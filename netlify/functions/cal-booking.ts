/**
 * Cal.com webhook → Meta Conversions API (server-side Schedule event).
 *
 * Fires the Pixel `Schedule` event from the server so ad attribution
 * survives ad blockers, iOS ITP, and any browser-side tracking failure.
 *
 * Dedup with the client-side Pixel: we use `event_id = booking.uid`, and
 * the client `bookingSuccessful` handler in BookingScripts.astro passes
 * the same uid as `eventID` to fbq('track','Schedule'). Meta merges them
 * into one event for the same uid + name + ~60s window.
 *
 * Required env vars (Netlify UI → Site settings → Environment variables):
 *   META_CAPI_ACCESS_TOKEN   secret — Pixel-scoped token from Events Manager
 *   CAL_WEBHOOK_SECRET       secret — the HMAC secret set in Cal.com webhook config
 *
 * Already in netlify.toml (PUBLIC_*, safe to commit):
 *   PUBLIC_FB_PIXEL_ID       the Pixel id — re-used here as the data source id
 *
 * Optional:
 *   META_TEST_EVENT_CODE     when set, events show in Events Manager → Test Events
 *
 * Webhook URL to give Cal.com:
 *   https://pillexislabs.com/.netlify/functions/cal-booking
 *   (also routed at /api/cal-booking via netlify.toml redirect)
 */

import crypto from 'node:crypto';
import type { Handler, HandlerEvent } from '@netlify/functions';

const PIXEL_ID = process.env.PUBLIC_FB_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const CAL_SECRET = process.env.CAL_WEBHOOK_SECRET;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const GRAPH_VERSION = 'v21.0';

type CalAttendee = { name?: string; email?: string; phoneNumber?: string };
type CalEventType = { title?: string; length?: number; slug?: string };
type CalPayload = {
  uid?: string;
  id?: number;
  createdAt?: string;
  startTime?: string;
  attendees?: CalAttendee[];
  eventType?: CalEventType;
  metadata?: Record<string, unknown>;
  responses?: Record<string, { value?: unknown }>;
};
type CalWebhookBody = {
  triggerEvent?: string;
  createdAt?: string;
  payload?: CalPayload;
};

const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s.trim().toLowerCase()).digest('hex');

const normPhone = (p: string) => p.replace(/\D/g, '');

const verifySignature = (body: string, sig: string | undefined): boolean => {
  if (!sig || !CAL_SECRET) return false;
  const expected = crypto.createHmac('sha256', CAL_SECRET).update(body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const header = (event: HandlerEvent, name: string): string | undefined => {
  const lower = name.toLowerCase();
  for (const k of Object.keys(event.headers || {})) {
    if (k.toLowerCase() === lower) return event.headers[k] ?? undefined;
  }
  return undefined;
};

const pickMetadata = (booking: CalPayload, key: string): string | undefined => {
  const fromMeta = booking.metadata?.[key];
  if (typeof fromMeta === 'string' && fromMeta) return fromMeta;
  const fromResponses = booking.responses?.[key]?.value;
  if (typeof fromResponses === 'string' && fromResponses) return fromResponses;
  return undefined;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!PIXEL_ID || !CAPI_TOKEN || !CAL_SECRET) {
    console.error('cal-booking: missing required env vars', {
      hasPixel: !!PIXEL_ID,
      hasToken: !!CAPI_TOKEN,
      hasSecret: !!CAL_SECRET,
    });
    return { statusCode: 500, body: 'Server not configured' };
  }

  const rawBody = event.body ?? '';
  const sig = header(event, 'x-cal-signature-256');
  if (!verifySignature(rawBody, sig)) {
    console.warn('cal-booking: invalid signature');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  let body: CalWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: 'Bad JSON' };
  }

  // Only fire Schedule for new bookings. Reschedules / cancels skip silently
  // so we don't inflate the conversion count.
  if (body.triggerEvent !== 'BOOKING_CREATED') {
    return {
      statusCode: 200,
      body: JSON.stringify({ skipped: body.triggerEvent ?? 'unknown' }),
    };
  }

  const booking = body.payload ?? {};
  const attendee = booking.attendees?.[0] ?? {};

  const eventId = booking.uid || (booking.id != null ? String(booking.id) : crypto.randomUUID());
  const eventTime = Math.floor(
    new Date(booking.createdAt ?? body.createdAt ?? Date.now()).getTime() / 1000,
  );

  const fbc = pickMetadata(booking, 'fbc');
  const fbp = pickMetadata(booking, 'fbp');
  const landingUrl = pickMetadata(booking, 'landingUrl') || 'https://pillexislabs.com/';

  const userData: Record<string, unknown> = {};
  if (attendee.email) userData.em = [sha256(attendee.email)];
  if (attendee.phoneNumber) userData.ph = [sha256(normPhone(attendee.phoneNumber))];
  if (attendee.name) {
    const parts = attendee.name.trim().split(/\s+/);
    if (parts[0]) userData.fn = [sha256(parts[0])];
    if (parts.length > 1) userData.ln = [sha256(parts.slice(1).join(' '))];
  }
  if (fbc) userData.fbc = fbc;
  if (fbp) userData.fbp = fbp;

  const ip =
    header(event, 'x-nf-client-connection-ip') ||
    header(event, 'x-forwarded-for')?.split(',')[0]?.trim();
  const ua = header(event, 'user-agent');
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;

  const metaPayload = {
    data: [
      {
        event_name: 'Schedule',
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        event_source_url: landingUrl,
        user_data: userData,
        custom_data: {
          currency: 'INR',
          value: 0,
          content_name: booking.eventType?.title || 'Pillexis Labs intro call',
          content_category: 'intro_call',
          booking_uid: booking.uid ?? null,
        },
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`;

  const metaRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metaPayload),
  });
  const metaJson = await metaRes.json().catch(() => ({}));

  if (!metaRes.ok) {
    console.error('cal-booking: Meta CAPI failed', {
      status: metaRes.status,
      eventId,
      meta: metaJson,
    });
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'meta_capi_failed', status: metaRes.status, meta: metaJson }),
    };
  }

  console.log('cal-booking: Meta CAPI ok', {
    eventId,
    bookingUid: booking.uid,
    attendeeEmailDomain: attendee.email?.split('@')[1],
    eventsReceived: (metaJson as { events_received?: number }).events_received,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, eventId, meta: metaJson }),
  };
};

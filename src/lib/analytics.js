/**
 * Thin wrapper around GA4 + Facebook Pixel.
 * Both are loaded sitewide in BaseLayout.astro.
 *
 * Call these from any client script (Quiz.astro, etc).
 * They no-op safely if the trackers aren't loaded yet
 * (e.g. dev mode without env vars set).
 */

const PIXEL_ID = import.meta.env.PUBLIC_FB_PIXEL_ID;

/**
 * SHA-256 hex hash of a normalized string (trim + lowercase). Matches the
 * hashing in netlify/functions/cal-booking.ts so browser + server events
 * for the same booking carry identical user_data hashes — otherwise Meta's
 * dedup rule (same event_id → keep browser event) discards the server email
 * hash and Event Match Quality drops to 0% coverage.
 */
async function sha256Hex(input) {
  if (typeof input !== 'string' || !input) return null;
  if (typeof crypto === 'undefined' || !crypto.subtle) return null;
  const bytes = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function track(eventName, params = {}) {
  // GA4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try { window.gtag('event', eventName, params); } catch {}
  }

  // Facebook Pixel — uses custom event API for non-standard events
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try { window.fbq('trackCustom', eventName, params); } catch {}
  }
}

/** Specific helpers for the quiz funnel. */
export const quizEvents = {
  started(slug) {
    track('quiz_started', { tool: slug });
  },
  answered(slug, qid, value) {
    track('quiz_question_answered', { tool: slug, question_id: qid, value });
  },
  completed(slug, tier, score) {
    track('quiz_completed', { tool: slug, tier, score });
  },
  shared(slug, tier, channel) {
    track('quiz_result_shared', { tool: slug, tier, channel });
  },
  ctaClicked(slug, tier, destination) {
    track('quiz_cta_clicked', { tool: slug, tier, destination });
  },
};

/** Booking funnel helpers. Wired to Cal.com popup widget. */
export const bookingEvents = {
  /** Fires when any "Book a call" CTA is clicked, before the popup opens. */
  clicked(source) {
    track('book_call_clicked', { source });
    // Pixel: InitiateCheckout (standard event) for ads optimization
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try { window.fbq('track', 'InitiateCheckout', { content_name: 'intro_call', source }); } catch {}
    }
  },
  /**
   * Fires when Cal.com confirms a booking via its bookingSuccessful callback.
   * `eventId` is the Cal booking uid — passed as Pixel `eventID` for dedup
   * with the server-side Conversions API event from netlify/functions/cal-booking.ts.
   *
   * Also pushes hashed email + first/last name into Pixel Advanced Matching
   * so the browser event carries the same identifiers as the CAPI event.
   * Without this, Meta's browser-priority dedup keeps the (empty) browser
   * event and drops the CAPI email hash → EMQ collapses to 0% coverage.
   */
  async scheduled(detail, eventId) {
    const meta = {
      event_type: detail?.eventType?.title || 'intro_call',
      duration: detail?.eventType?.length,
    };
    track('call_booked', { ...meta, event_id: eventId });

    const attendee = detail?.booking?.attendees?.[0] || detail?.attendees?.[0];
    const advancedMatch = {};
    if (attendee?.email) {
      const em = await sha256Hex(attendee.email);
      if (em) advancedMatch.em = em;
    }
    if (attendee?.name) {
      const parts = attendee.name.trim().split(/\s+/);
      if (parts[0]) {
        const fn = await sha256Hex(parts[0]);
        if (fn) advancedMatch.fn = fn;
      }
      if (parts.length > 1) {
        const ln = await sha256Hex(parts.slice(1).join(' '));
        if (ln) advancedMatch.ln = ln;
      }
    }

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        if (PIXEL_ID && Object.keys(advancedMatch).length > 0) {
          window.fbq('init', PIXEL_ID, advancedMatch);
        }
        if (eventId) {
          window.fbq('track', 'Schedule', meta, { eventID: eventId });
        } else {
          window.fbq('track', 'Schedule', meta);
        }
      } catch {}
    }
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          value: 1,
          currency: 'INR',
          event_id: eventId,
          ...meta,
        });
      } catch {}
    }
  },
};

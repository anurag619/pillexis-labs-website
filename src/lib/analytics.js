/**
 * Thin wrapper around GA4 + Facebook Pixel.
 * Both are loaded sitewide in BaseLayout.astro.
 *
 * Call these from any client script (Quiz.astro, etc).
 * They no-op safely if the trackers aren't loaded yet
 * (e.g. dev mode without env vars set).
 */

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
   */
  scheduled(detail, eventId) {
    const meta = {
      event_type: detail?.eventType?.title || 'intro_call',
      duration: detail?.eventType?.length,
    };
    track('call_booked', { ...meta, event_id: eventId });
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
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

'use client';

import { useEffect } from 'react';

/**
 * Remembers where a visitor came from, so the booking can say which ad sent it.
 *
 * Meta and Google read UTM tags from the landing URL, but the site then moves
 * between pages without reloading, so by the registration form the tags are
 * gone. This stores them on the first visit that carries any, and the form
 * sends them with the registration.
 *
 * First touch wins for 30 days: a later visit without tags (or with different
 * ones) does not overwrite the source that brought the person in. Storage can
 * be blocked or cleared, so every access is wrapped and failure only means the
 * booking has no source recorded.
 */

export const ATTRIBUTION_KEY = 'cw_attribution';
export const ATTRIBUTION_FIELDS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid',
];
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function readStoredAttribution() {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function UtmCapture() {
  useEffect(() => {
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch {
      return;
    }

    const found = {};
    for (const key of ATTRIBUTION_FIELDS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 200);
    }
    if (!Object.keys(found).length) return;

    const existing = readStoredAttribution();
    const age = existing?.capturedAt ? Date.now() - Date.parse(existing.capturedAt) : Infinity;
    if (existing && age < MAX_AGE_MS) return;

    try {
      window.localStorage.setItem(
        ATTRIBUTION_KEY,
        JSON.stringify({
          ...found,
          landingPage: window.location.pathname,
          capturedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Storage blocked. The booking simply records no source.
    }
  }, []);

  return null;
}

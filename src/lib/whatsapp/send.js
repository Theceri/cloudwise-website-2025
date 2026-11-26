import 'server-only';

/**
 * WhatsApp delivery via WAHA, the self-hosted WhatsApp gateway on the One Voice
 * server (https://waha.cloudwise.co.ke).
 *
 * WAHA drives a linked WhatsApp account, the same way WhatsApp Web does. The
 * admin alerts go out from that account to ADMIN_WHATSAPP. When the two are the
 * same number, the alerts land in the "Message yourself" chat.
 *
 * Called straight over HTTPS: the API we use is one endpoint wide.
 */

// A payment webhook awaits the admin alert, and Safaricom retries a webhook that
// answers slowly. WhatsApp must never be the reason it does.
const TIMEOUT_MS = 5000;

// WhatsApp accepts far more, but an alert longer than this is not being read.
const MAX_LENGTH = 3500;

/** "0712 658 775", "+254712658775" or "254712658775" → "254712658775@c.us". */
export function toChatId(value) {
  const raw = String(value || '').trim();
  if (raw.endsWith('@c.us') || raw.endsWith('@g.us')) return raw;

  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) digits = `254${digits.slice(1)}`;
  if (digits.length === 9 && /^[17]/.test(digits)) digits = `254${digits}`;
  return digits.length >= 11 ? `${digits}@c.us` : null;
}

export function whatsappConfig() {
  return {
    url: (process.env.WAHA_URL || '').replace(/\/+$/, ''),
    apiKey: process.env.WAHA_API_KEY || '',
    session: process.env.WAHA_SESSION || 'default',
    // Comma-separated phone numbers. Everyone here gets the admin alerts.
    admins: (process.env.ADMIN_WHATSAPP || '')
      .split(',')
      .map(toChatId)
      .filter(Boolean),
  };
}

export function isWhatsAppConfigured() {
  const cfg = whatsappConfig();
  return Boolean(cfg.url && cfg.apiKey);
}

function trim(text) {
  const value = String(text || '').trim();
  return value.length > MAX_LENGTH ? `${value.slice(0, MAX_LENGTH - 20).trimEnd()}\n\n… (cut short)` : value;
}

/**
 * Send one text to one or more chats. Resolves to `{ ok, sent, results }` and
 * never throws: like an email, a failed WhatsApp alert must not roll back a
 * payment we have already taken.
 */
export async function sendWhatsApp({ to, text }) {
  const cfg = whatsappConfig();
  const chats = (Array.isArray(to) ? to : [to]).map(toChatId).filter(Boolean);
  const body = trim(text);

  if (!cfg.url || !cfg.apiKey) {
    console.warn('[whatsapp] WAHA_URL or WAHA_API_KEY not set. Alert skipped.');
    return { ok: false, skipped: true, reason: 'not configured' };
  }
  if (!chats.length) return { ok: false, skipped: true, reason: 'no recipients' };
  if (!body) return { ok: false, skipped: true, reason: 'empty message' };

  const results = await Promise.all(
    chats.map(async (chatId) => {
      try {
        const res = await fetch(`${cfg.url}/api/sendText`, {
          method: 'POST',
          headers: {
            'X-Api-Key': cfg.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          // No link previews: building one makes WAHA fetch the page first, which
          // is slow, and the alerts carry several links.
          body: JSON.stringify({ session: cfg.session, chatId, text: body, linkPreview: false }),
          cache: 'no-store',
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          const error = json?.message || json?.error || `HTTP ${res.status}`;
          console.error(`[whatsapp] WAHA rejected the message to ${chatId}:`, error);
          return { chatId, ok: false, error };
        }
        // The NOWEB engine answers with `key.id`; the browser engines with `id`.
        return { chatId, ok: true, id: json?.key?.id || json?.id?._serialized || json?.id || null };
      } catch (err) {
        const error = err?.name === 'TimeoutError' ? `no answer in ${TIMEOUT_MS / 1000}s` : err?.message;
        console.error(`[whatsapp] send to ${chatId} failed:`, error);
        return { chatId, ok: false, error };
      }
    })
  );

  const sent = results.filter((r) => r.ok).length;
  return { ok: sent > 0, sent, of: results.length, results };
}

/**
 * The WAHA session's state. "WORKING" means the linked phone is connected and
 * messages will go out. Anything else means somebody must re-link the phone in
 * the WAHA dashboard.
 */
export async function whatsappSessionStatus() {
  const cfg = whatsappConfig();
  if (!cfg.url || !cfg.apiKey) return { ok: false, status: 'NOT_CONFIGURED' };

  try {
    const res = await fetch(`${cfg.url}/api/sessions/${encodeURIComponent(cfg.session)}`, {
      headers: { 'X-Api-Key': cfg.apiKey, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: `HTTP ${res.status}`, error: json?.message || null };
    return { ok: json.status === 'WORKING', status: json.status, number: json.me?.id || null };
  } catch (err) {
    return { ok: false, status: 'UNREACHABLE', error: err?.message };
  }
}

/** Message every ADMIN_WHATSAPP number. */
export async function sendWhatsAppToAdmins(text) {
  const { admins } = whatsappConfig();
  if (!admins.length) {
    console.warn('[whatsapp] ADMIN_WHATSAPP not set. Admin alert skipped.');
    return { ok: false, skipped: true, reason: 'no admin numbers' };
  }
  return sendWhatsApp({ to: admins, text });
}

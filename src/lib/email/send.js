import 'server-only';

import { claimOnce, releaseClaim, recordEmailSent } from '@/lib/store';
import { sendWhatsAppToAdmins } from '@/lib/whatsapp/send';

/**
 * Email delivery via Resend.
 *
 * Called straight over HTTPS rather than through the SDK: one dependency fewer,
 * and the API is two fields wide.
 */

const RESEND_API = 'https://api.resend.com/emails';

export function emailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'Cloudwise Training <training@cloudwise.co.ke>',
    replyTo: process.env.EMAIL_REPLY_TO || 'hello@cloudwise.co.ke',
    // Comma-separated. Both Cloudwise and the partner get the admin alerts.
    admins: (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function isEmailConfigured() {
  return Boolean(emailConfig().apiKey);
}

/**
 * Send one email. Resolves to `{ ok, id }` and never throws — a failed
 * notification must not roll back a payment we have already taken.
 */
export async function sendEmail({ to, subject, html, text, replyTo, bcc, tags, attachments }) {
  const cfg = emailConfig();
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);

  if (!cfg.apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${recipients.join(', ')}`);
    return { ok: false, skipped: true, reason: 'not configured' };
  }
  if (!recipients.length) return { ok: false, skipped: true, reason: 'no recipients' };

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: cfg.from,
        to: recipients,
        subject,
        html,
        ...(text ? { text } : {}),
        ...(bcc?.length ? { bcc } : {}),
        // Resend takes base64 in `content`. Nulls are filtered so a builder can
        // return "no attachment" without the caller having to check.
        ...(attachments?.filter(Boolean).length
          ? { attachments: attachments.filter(Boolean) }
          : {}),
        reply_to: replyTo || cfg.replyTo,
        ...(tags ? { tags } : {}),
      }),
      cache: 'no-store',
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`[email] Resend rejected "${subject}":`, body?.message || res.status);
      return { ok: false, error: body?.message || `HTTP ${res.status}` };
    }
    return { ok: true, id: body.id };
  } catch (err) {
    console.error(`[email] send failed for "${subject}":`, err?.message);
    return { ok: false, error: err?.message };
  }
}

/**
 * Send a lifecycle email at most once per registration.
 *
 * The claim is taken *before* the send, so two concurrent webhook deliveries
 * cannot both get through. If the send then fails we release the claim so a
 * later retry — a cron pass, or the customer refreshing the status page — can
 * try again.
 */
export async function sendOnce({ reference, key, ...message }) {
  const lockKey = `email.${reference}.${key}`;

  if (!(await claimOnce(lockKey))) {
    return { ok: false, skipped: true, reason: 'already sent' };
  }

  const result = await sendEmail(message);

  if (result.ok) {
    await recordEmailSent(reference, key).catch(() => {});
  } else {
    // Nothing was delivered — whether Resend rejected it or the key was not
    // configured yet — so give the claim back. Otherwise the very first
    // registration made before RESEND_API_KEY is set would be permanently
    // locked out of its own confirmation email.
    await releaseClaim(lockKey);
  }

  return result;
}

/**
 * WhatsApp text for a message that did not bring its own: the subject in bold,
 * then the plain-text body. Every admin alert should pass `whatsapp`, because the
 * plain text of an email with a roster table in it is far too long for a chat.
 */
function fallbackWhatsApp({ subject, text }) {
  return [subject && `*${subject}*`, text].filter(Boolean).join('\n\n');
}

/**
 * Notify every admin, by email (ADMIN_EMAILS) and on WhatsApp (ADMIN_WHATSAPP),
 * side by side. Pass `whatsapp` with the short chat version of the alert.
 *
 * Resolves to the email result with the WhatsApp result under `whatsapp`, so
 * the callers that only look at the email keep working.
 */
export async function sendToAdmins({ whatsapp, ...message }) {
  const { admins } = emailConfig();
  if (!admins.length) console.warn('[email] ADMIN_EMAILS not set — admin notification skipped.');

  const [email, chat] = await Promise.all([
    admins.length
      ? sendEmail({ ...message, to: admins })
      : { ok: false, skipped: true, reason: 'no admin addresses' },
    sendWhatsAppToAdmins(whatsapp || fallbackWhatsApp(message)),
  ]);

  return { ...email, whatsapp: chat };
}

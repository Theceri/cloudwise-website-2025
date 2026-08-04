import { COMPANY_INFO, SITE_URL, SOCIAL_LINKS } from '@/lib/constants';

/**
 * Email chrome.
 *
 * Email clients are stuck in 2005: tables for layout, inline styles only, no
 * flexbox or grid, and Outlook ignores background images. Everything here is
 * deliberately plain so it renders the same in Gmail, Outlook and iOS Mail.
 */

const INK = '#0A0A0B';
const EMBER = '#FF3F1A';
const PAPER = '#FFFFFF';
const MUTED = '#5B5B62';
const LINE = '#E6E6EA';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function button(label, href) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:999px;background:${EMBER};">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** A key/value block — event details, receipts, payment instructions. */
export function detailTable(rows) {
  const body = rows
    .filter(Boolean)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:9px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${MUTED};vertical-align:top;width:38%;">${escapeHtml(label)}</td>
        <td style="padding:9px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${INK};font-weight:600;vertical-align:top;">${value}</td>
      </tr>`
    )
    .join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
           style="margin:20px 0;border:1px solid ${LINE};border-radius:14px;padding:8px 20px;">
      ${body}
    </table>`;
}

/** A callout for the thing we most want them to notice. */
export function highlight(title, bodyHtml) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
           style="margin:22px 0;background:#FFF4F1;border:1px solid #FFD4C9;border-radius:14px;">
      <tr>
        <td style="padding:20px 22px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${EMBER};font-weight:700;">${escapeHtml(title)}</p>
          <div style="font-size:15px;line-height:1.6;color:${INK};">${bodyHtml}</div>
        </td>
      </tr>
    </table>`;
}

/** A monospace block for prompts people will copy out. */
export function codeBlock(content) {
  return `
    <pre style="margin:14px 0;padding:16px 18px;background:#F6F6F8;border:1px solid ${LINE};border-radius:12px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:13px;line-height:1.55;color:${INK};white-space:pre-wrap;word-break:break-word;">${escapeHtml(content)}</pre>`;
}

export function paragraph(html) {
  return `<p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#2B2B31;">${html}</p>`;
}

export function heading(text, level = 2) {
  const size = level === 2 ? 20 : 17;
  return `<h${level} style="margin:32px 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:${size}px;line-height:1.3;color:${INK};font-weight:700;">${escapeHtml(text)}</h${level}>`;
}

export function list(items, { ordered = false } = {}) {
  const tag = ordered ? 'ol' : 'ul';
  const body = items
    .filter(Boolean)
    .map(
      (item) =>
        `<li style="margin:0 0 9px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B2B31;">${item}</li>`
    )
    .join('');
  return `<${tag} style="margin:0 0 18px;padding-left:22px;">${body}</${tag}>`;
}

/**
 * Wrap body HTML in the branded shell.
 *
 * `preheader` is the grey line Gmail shows after the subject in the inbox list —
 * left empty it leaks whatever text comes first, so we always set it.
 */
export function emailShell({ title, preheader, bodyHtml, footerNote, kicker }) {
  const socials = SOCIAL_LINKS.map(
    (s) =>
      `<a href="${escapeHtml(s.href)}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(s.name)}</a>`
  ).join(' &nbsp;·&nbsp; ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F2F2F5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader || '')}</div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F2F2F5;">
    <tr>
      <td align="center" style="padding:28px 14px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">

          <tr>
            <td style="padding:22px 26px;background:${INK};border-radius:18px 18px 0 0;">
              <a href="${SITE_URL}" style="font-family:Helvetica,Arial,sans-serif;font-size:19px;font-weight:700;color:${PAPER};text-decoration:none;letter-spacing:-0.01em;">
                Cloudwise<span style="color:${EMBER};">.</span>
              </a>
              <span style="float:right;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,.55);padding-top:5px;">${escapeHtml(kicker || 'AI Productivity Training')}</span>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 26px 30px;background:${PAPER};">
              ${bodyHtml}
            </td>
          </tr>

          <tr>
            <td style="padding:22px 26px 30px;background:${PAPER};border-radius:0 0 18px 18px;border-top:1px solid ${LINE};">
              ${
                footerNote
                  ? `<p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED};">${footerNote}</p>`
                  : ''
              }
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED};">
                <strong style="color:${INK};">${escapeHtml(COMPANY_INFO.legalName)}</strong><br>
                ${escapeHtml(COMPANY_INFO.address.line1)}, ${escapeHtml(COMPANY_INFO.address.line2)}, ${escapeHtml(COMPANY_INFO.address.city)}<br>
                <a href="mailto:${COMPANY_INFO.email}" style="color:${MUTED};">${escapeHtml(COMPANY_INFO.email)}</a> &nbsp;·&nbsp; ${escapeHtml(COMPANY_INFO.phone)}
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${MUTED};">${socials}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * A plain-text fallback derived from the HTML.
 *
 * Some corporate mail gateways strip HTML entirely, and a missing text part
 * hurts deliverability, so every send carries one.
 */
export function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h1|h2|h3|pre)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

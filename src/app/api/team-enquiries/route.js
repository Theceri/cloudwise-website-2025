import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { onTeamEnquiry } from '@/lib/hubspot';
import { escapeHtml } from '@/lib/email/layout';
import { readAttribution, sendEvent } from '@/lib/meta/capi';
import { META_CURRENCY, META_EVENTS, metaEventId } from '@/lib/meta/events';
import { normalisePhone } from '@/lib/payments/daraja';
import { EMAIL_RE, PHONE_RE } from '@/lib/registration-form';
import { isStoreConfigured } from '@/lib/store';
import { writeClient } from '@/sanity/lib/writeClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FORMATS = ['team-programme', 'private', 'executive', 'copilot', 'demo', 'unsure'];

const clean = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * A team or private training enquiry from /ai-training/teams.
 *
 * Stored in Sanity (Studio → Training → Team enquiries), emailed to the admins
 * so someone calls the same day, and reported to Meta as a server Lead.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const value = {
    name: clean(body?.name, 120),
    organization: clean(body?.organization, 160),
    role: clean(body?.role, 120),
    email: clean(body?.email, 160),
    phone: clean(body?.phone, 20),
    teamSize: Number.parseInt(body?.teamSize, 10) || 0,
    format: FORMATS.includes(body?.format) ? body.format : 'unsure',
    preferredMonth: clean(body?.preferredMonth, 40),
    message: clean(body?.message, 2000),
  };

  const errors = {};
  if (value.name.length < 2) errors.name = 'Please tell us your name.';
  if (!value.organization) errors.organization = 'Which organisation is this for?';
  if (!EMAIL_RE.test(value.email)) errors.email = 'That email does not look right.';
  if (!PHONE_RE.test(value.phone.replace(/[\s-]/g, ''))) errors.phone = 'Use a Kenyan mobile number, e.g. 0712 345 678.';
  if (value.teamSize < 1 || value.teamSize > 5000) errors.teamSize = 'How many people, roughly?';
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 400 });
  }

  if (!isStoreConfigured()) {
    return NextResponse.json(
      { error: 'Enquiries are not configured yet. Please message us on WhatsApp.' },
      { status: 503 }
    );
  }

  const utm = body?.attribution && typeof body.attribution === 'object'
    ? [body.attribution.utm_source, body.attribution.utm_campaign, body.attribution.utm_content].filter(Boolean).join(' · ').slice(0, 200)
    : '';

  let doc;
  try {
    doc = await writeClient.create({
      _type: 'teamEnquiry',
      status: 'new',
      ...value,
      phone: normalisePhone(value.phone) || value.phone,
      utm: utm || null,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[team-enquiries] create failed:', err?.message);
    return NextResponse.json({ error: 'We could not save your enquiry. Please try again.' }, { status: 500 });
  }

  const rows = [
    ['Name', value.name],
    ['Organisation', value.organization],
    ['Role', value.role || '—'],
    ['Email', value.email],
    ['Phone', value.phone],
    ['Team size', String(value.teamSize)],
    ['Format', value.format],
    ['Preferred month', value.preferredMonth || '—'],
    ['Ad source', utm || '—'],
  ];

  await Promise.allSettled([
    onTeamEnquiry({ ...value, utm }),
    sendToAdmins({
      subject: `🏢 Team training enquiry: ${value.organization} (${value.teamSize} people)`,
      html: `<p><strong>${escapeHtml(value.name)}</strong> asked about ${escapeHtml(value.format)} training for <strong>${escapeHtml(
        value.organization
      )}</strong>. Call the same day.</p><table>${rows
        .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666;">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table>${value.message ? `<p>${escapeHtml(value.message)}</p>` : ''}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (value.message ? `\n\n${value.message}` : ''),
    }),
    sendEvent({
      eventName: META_EVENTS.lead,
      eventId: metaEventId(META_EVENTS.lead, `team-${doc._id}`),
      registration: { email: value.email, phone: normalisePhone(value.phone), firstName: value.name.split(' ')[0] },
      attribution: readAttribution(request, { eventSourceUrl: body?.pageUrl }),
      customData: { currency: META_CURRENCY, value: 0, content_category: 'Team training' },
    }),
  ]);

  return NextResponse.json({ ok: true, id: doc._id, eventId: metaEventId(META_EVENTS.lead, `team-${doc._id}`) }, { status: 201 });
}

import { NextResponse } from 'next/server';

import { COMPANY_INFO } from '@/lib/constants';
import { sendEmail } from '@/lib/email/send';
import { escapeHtml } from '@/lib/email/layout';
import { EMAIL_RE } from '@/lib/registration-form';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * The contact form's "Send by email" route. The other button opens WhatsApp;
 * this one sends the same message to hello@cloudwise.co.ke, with the sender as
 * the reply-to address so a reply goes straight back to them.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const form = {
    name: clean(body?.name, 120),
    email: clean(body?.email, 160),
    phone: clean(body?.phone, 30),
    company: clean(body?.company, 160),
    message: clean(body?.message, 4000),
  };

  if (form.name.length < 2 || !EMAIL_RE.test(form.email) || form.message.length < 5) {
    return NextResponse.json({ error: 'Please add your name, a valid email and your message.' }, { status: 400 });
  }

  const rows = [
    ['Name', form.name],
    ['Email', form.email],
    ['Phone', form.phone || '—'],
    ['Company', form.company || '—'],
  ];

  const result = await sendEmail({
    to: COMPANY_INFO.email,
    replyTo: form.email,
    subject: `Website enquiry: ${form.name}${form.company ? `, ${form.company}` : ''}`,
    html: `<table>${rows
      .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666;">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table><p style="white-space:pre-wrap;">${escapeHtml(form.message)}</p>`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${form.message}`,
  });

  if (!result?.ok) {
    return NextResponse.json(
      { error: 'We could not send that by email just now. Please use WhatsApp or call us.' },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}

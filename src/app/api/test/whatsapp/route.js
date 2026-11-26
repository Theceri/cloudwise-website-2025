import { NextResponse } from 'next/server';

import { SITE_URL } from '@/lib/constants';
import { escapeHtml } from '@/lib/email/layout';
import { sendToAdmins } from '@/lib/email/send';
import { isAuthorisedJob } from '@/lib/security';
import { sampleRegistration, sampleRoster } from '@/lib/test-samples';
import { TRACK_INDIVIDUAL, TRACK_KICKSTART, TRACK_WBH, TRACKS, listKickstartSessions } from '@/lib/training';
import * as alerts from '@/lib/whatsapp/alerts';
import { sendWhatsApp, whatsappConfig, whatsappSessionStatus } from '@/lib/whatsapp/send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Preview and test-send every admin WhatsApp alert.
 *
 * Protected by CRON_SECRET, since it will message any number.
 *
 *   GET  ?secret=…                    → alert keys, configuration and WAHA session status
 *   GET  ?secret=…&alert=paid         → the text of one alert
 *   POST ?secret=…                    → sends every alert to ADMIN_WHATSAPP
 *   POST ?secret=…  { "alert": … }    → sends just one
 *   POST ?secret=…  { "to": "07…" }   → sends to another number instead
 *   POST ?secret=…  { "viaAdmins": true, "alert": "paid" }
 *                                     → sends one alert the way a real one goes:
 *                                       email to ADMIN_EMAILS and WhatsApp to
 *                                       ADMIN_WHATSAPP, through sendToAdmins
 */

// The approve link in a real alert is signed and names a real booking. A test
// link goes nowhere, so tapping it in a test message cannot confirm anything.
const TEST_LINK = `${SITE_URL}/payments/approve?t=TEST-ONLY`;

function build(key) {
  const individual = sampleRegistration(TRACK_INDIVIDUAL);
  const masterclass = sampleRegistration(TRACK_WBH);
  const roster = sampleRoster(individual, masterclass);
  const pending = { ...individual, status: 'pending', paymentMethod: null, paymentReceipt: null, settlementState: null };
  const payment = {
    transactionId: 'TFB8Y3RL20',
    amount: individual.amount,
    typedReference: 'amina',
    payerName: 'AMINA WANJIRU',
  };

  switch (key) {
    case 'signup':
      return alerts.signupAlert({
        registration: { ...pending, utm: { utm_source: 'facebook', utm_campaign: 'ai-training', utm_content: 'video-1' } },
        roster,
        event: 'registered',
      });
    case 'signup-team-lead':
      return alerts.signupAlert({
        registration: { ...pending, teamLead: true, headcount: 12 },
        roster,
        event: 'registered',
      });
    case 'paid':
      return alerts.signupAlert({ registration: masterclass, roster, event: 'paid' });
    case 'paid-with-credit': {
      const kickstart = {
        ...individual,
        reference: 'CWK-9T2B6N',
        track: TRACK_KICKSTART,
        cohortId: listKickstartSessions({ count: 1 })[0]?.id || null,
        cohortLabel: listKickstartSessions({ count: 1 })[0]?.label || 'Kickstart',
        amount: TRACKS[TRACK_KICKSTART].priceKes,
      };
      const expires = new Date(Date.now() + 60 * 86400000).toISOString();
      return alerts.signupAlert({
        registration: kickstart,
        roster,
        event: 'paid',
        credit: { code: 'KS-AMINA-7Q', amountKes: kickstart.amount, appliesTo: ['essentials', 'programme'], expiresAt: expires },
      });
    }
    case 'digest':
      return alerts.dailyDigest({
        roster,
        todaysSignups: [individual, { ...pending, reference: 'A9K2M4', firstName: 'Grace', lastName: 'Achieng' }],
        dateLabel: new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Africa/Nairobi',
        }).format(new Date()),
        unmatched: [{ amount: 5000, externalId: 'TFC1Z9QW55', registrationRef: 'grace', createdAt: new Date().toISOString() }],
      });
    case 'settlement-failed':
      return alerts.settlementFailed({
        payment: { registrationRef: individual.reference, amount: individual.amount, settlementAdapter: 'daraja-b2b' },
        message: 'Insufficient float in the working account.',
      });
    case 'team-enquiry':
      return alerts.teamEnquiry({
        enquiry: {
          name: 'Peter Kamau',
          organization: 'Savannah Logistics Ltd',
          role: 'HR Manager',
          email: 'peter@example.co.ke',
          phone: '254722000111',
          teamSize: 25,
          format: 'team-programme',
          preferredMonth: 'January 2027',
          message: 'We want our operations and finance teams to use AI for reports and customer email.',
        },
        utm: 'linkedin · teams-q1',
      });
    case 'paybill-claim':
      return alerts.paybillClaim({ registration: pending, receipt: payment.transactionId, link: TEST_LINK });
    case 'paybill-unmatched':
      return alerts.paybillUnmatched({
        payment,
        candidates: [
          { registration: pending, why: ['amount', 'name'], link: TEST_LINK },
          { registration: { ...pending, reference: 'A9K2M4', firstName: 'Grace', lastName: 'Achieng' }, why: ['amount'], link: TEST_LINK },
        ],
      });
    case 'paybill-auto-matched':
      return alerts.paybillAutoMatched({ registration: individual, payment, matchedHow: 'phone number and amount' });
    case 'part-payment':
      return alerts.partPayment({ registration: pending, payment: { ...payment, amount: 2000 } });
    default:
      return null;
  }
}

const ALERT_KEYS = [
  'signup',
  'signup-team-lead',
  'paid',
  'paid-with-credit',
  'digest',
  'settlement-failed',
  'team-enquiry',
  'paybill-claim',
  'paybill-unmatched',
  'paybill-auto-matched',
  'part-payment',
];

export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get('alert');

  if (!key) {
    const cfg = whatsappConfig();
    return NextResponse.json({
      alerts: ALERT_KEYS,
      previewWith: '?secret=YOUR_CRON_SECRET&alert=paid',
      gateway: cfg.url || null,
      session: cfg.session,
      apiKeySet: Boolean(cfg.apiKey),
      admins: cfg.admins,
      sessionStatus: await whatsappSessionStatus(),
    });
  }

  const text = build(key);
  if (!text) {
    return NextResponse.json({ error: `Unknown alert: ${key}`, alerts: ALERT_KEYS }, { status: 400 });
  }
  return new NextResponse(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

export async function POST(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // An empty body is fine: every alert goes to ADMIN_WHATSAPP.
  }

  // The path every real alert takes: one email to ADMIN_EMAILS and one WhatsApp
  // message to ADMIN_WHATSAPP, side by side.
  if (body.viaAdmins) {
    const key = body.alert || 'paid';
    const text = build(key);
    if (!text) return NextResponse.json({ error: `Unknown alert: ${key}`, alerts: ALERT_KEYS }, { status: 400 });

    const result = await sendToAdmins({
      subject: `[TEST] Admin alert check: email and WhatsApp (${key})`,
      html: `<p>This is a test of the admin alert path. The same alert went to WhatsApp:</p><pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(text)}</pre>`,
      text,
      whatsapp: `🧪 *TEST* · admin alert path · ${key}\n\n${text}`,
    });
    return NextResponse.json({ alert: key, email: { ...result, whatsapp: undefined }, whatsapp: result.whatsapp });
  }

  const to = body.to || whatsappConfig().admins;
  if (!to || (Array.isArray(to) && !to.length)) {
    return NextResponse.json({ error: 'Pass { "to": "0712 345 678" }, or set ADMIN_WHATSAPP.' }, { status: 400 });
  }

  const keys = body.alert ? [body.alert] : ALERT_KEYS;
  const results = [];

  for (const [i, key] of keys.entries()) {
    const text = build(key);
    if (!text) {
      results.push({ alert: key, ok: false, error: 'unknown alert' });
      continue;
    }
    // A short gap between messages: a burst from one account is what WhatsApp
    // watches for.
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, 1500));

    // Marked so a test never gets mistaken for a real signup or payment.
    const result = await sendWhatsApp({ to, text: `🧪 *TEST* · ${key}\n\n${text}` });
    results.push({ alert: key, ...result });
  }

  return NextResponse.json({
    to,
    sent: results.filter((r) => r.ok).length,
    of: results.length,
    results,
  });
}

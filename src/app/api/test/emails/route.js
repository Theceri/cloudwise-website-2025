import { NextResponse } from 'next/server';

import { emailConfig, sendEmail } from '@/lib/email/send';
import * as templates from '@/lib/email/templates';
import { paybillInstructions } from '@/lib/payments/daraja';
import { isAuthorisedJob } from '@/lib/security';
import {
  TRACK_INDIVIDUAL,
  TRACK_WBH,
  TRACKS,
  describeSchedule,
  listOpenCohorts,
  startDateFor,
} from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Preview and test-send every lifecycle email.
 *
 * Protected by CRON_SECRET, since it will happily post mail to any address.
 *
 *   GET  ?secret=…&template=welcome-pack        → renders the HTML in the browser
 *   GET  ?secret=…                              → lists the template keys
 *   POST ?secret=…  { "to": "you@example.com" } → sends every template to you
 *   POST ?secret=…  { "to": …, "template": … }  → sends just one
 *
 * Sample data mirrors a real registration closely enough that a formatting
 * problem shows up here rather than in a customer's inbox.
 */

function sampleRegistration(track = TRACK_INDIVIDUAL) {
  const cohort = listOpenCohorts({ count: 1 })[0];
  const isWbh = track === TRACK_WBH;

  const base = {
    reference: isWbh ? 'CWW-7F3K2M' : 'CWI-4H8P3R',
    track,
    status: 'paid',
    firstName: 'Amina',
    lastName: 'Wanjiru',
    email: 'amina@example.co.ke',
    phone: '254712345678',
    organization: 'Royaume Enterprises',
    jobTitle: 'Founder',
    city: 'Nairobi',
    industry: 'Food & Catering',
    attendance: isWbh ? 'in-person' : 'online',
    aiExperience: 'Yes, a few times',
    aiTools: ['ChatGPT', 'Canva AI'],
    timeConsumingTasks: ['Everything — I do it all myself', 'Social media & marketing'],
    topicPriorities: isWbh
      ? ['Responding to RFPs & writing proposals on my letterhead', 'Making AI writing sound like me, not like AI']
      : [],
    biggestChallenge: 'Mondays and Tuesdays are very quiet and I lose money on those days.',
    goal: 'I want to stop spending my evenings writing proposals.',
    liveChallenge: 'Responding to tenders — it takes me a whole weekend every time.',
    dietary: 'Vegetarian',
    referralSource: 'Instagram',
    whatsappOptIn: true,
    amount: TRACKS[track].priceKes,
    paymentMethod: 'mpesa-stk',
    paymentReceipt: 'TFA7X2QK91',
    paidAt: new Date().toISOString(),
    settlementState: 'settled',
    createdAt: new Date().toISOString(),
  };

  if (isWbh) {
    return { ...base, cohortId: null, cohortLabel: null, startDate: TRACKS[TRACK_WBH].eventDate };
  }

  return {
    ...base,
    cohortId: cohort?.id || null,
    cohortLabel: cohort
      ? describeSchedule({ track, cohortId: cohort.id }).headline
      : 'Dates to be confirmed',
    startDate: startDateFor({ track, cohortId: cohort?.id }),
  };
}

function build(templateKey) {
  const individual = sampleRegistration(TRACK_INDIVIDUAL);
  const masterclass = sampleRegistration(TRACK_WBH);
  const paybill = paybillInstructions(individual.reference);
  const roster = [individual, masterclass, { ...individual, reference: 'CWI-9K2M4T', status: 'pending', firstName: 'Grace', lastName: 'Achieng' }];

  switch (templateKey) {
    case 'registration-received':
      return templates.registrationReceived({
        registration: { ...individual, status: 'pending' },
        paybill,
      });
    case 'payment-confirmed':
      return templates.paymentConfirmed({ registration: individual });
    case 'welcome-pack':
      return templates.welcomePack({ registration: individual });
    case 'reminder-3d':
      return templates.reminder({ registration: individual, daysOut: 3 });
    case 'reminder-1d':
      return templates.reminder({ registration: individual, daysOut: 1 });
    case 'payment-failed':
      return templates.paymentFailed({
        registration: { ...individual, status: 'pending' },
        reason: 'Request cancelled by user',
        paybill,
      });
    case 'completion-pack':
      return templates.completionPack({ registration: individual });
    case 'masterclass-confirmed':
      return templates.paymentConfirmed({ registration: masterclass });
    case 'masterclass-welcome-pack':
      return templates.welcomePack({ registration: masterclass });
    case 'admin-signup':
      return templates.adminSignupAlert({ registration: individual, roster, event: 'registered' });
    case 'admin-paid':
      return templates.adminSignupAlert({ registration: masterclass, roster, event: 'paid' });
    case 'admin-digest':
      return templates.adminDailyDigest({
        roster,
        todaysSignups: [individual, masterclass],
        dateLabel: new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Africa/Nairobi',
        }).format(new Date()),
      });
    case 'admin-settlement-failed':
      return templates.adminSettlementFailed({
        payment: {
          registrationRef: individual.reference,
          amount: individual.amount,
          settlementAdapter: 'daraja-b2b',
          settlementMessage: 'Insufficient float in the working account.',
        },
        message: 'Insufficient float in the working account.',
      });
    default:
      return null;
  }
}

const TEMPLATE_KEYS = [
  'registration-received',
  'payment-confirmed',
  'welcome-pack',
  'reminder-3d',
  'reminder-1d',
  'payment-failed',
  'completion-pack',
  'masterclass-confirmed',
  'masterclass-welcome-pack',
  'admin-signup',
  'admin-paid',
  'admin-digest',
  'admin-settlement-failed',
];

export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const templateKey = new URL(request.url).searchParams.get('template');

  if (!templateKey) {
    return NextResponse.json({
      templates: TEMPLATE_KEYS,
      previewWith: '?secret=YOUR_CRON_SECRET&template=welcome-pack',
      emailConfigured: Boolean(emailConfig().apiKey),
      admins: emailConfig().admins,
    });
  }

  const message = build(templateKey);
  if (!message) {
    return NextResponse.json({ error: `Unknown template: ${templateKey}`, templates: TEMPLATE_KEYS }, { status: 400 });
  }

  return new NextResponse(message.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // An empty body is fine — we fall back to the admin addresses below.
  }

  const to = body.to || emailConfig().admins;
  if (!to || (Array.isArray(to) && !to.length)) {
    return NextResponse.json(
      { error: 'Pass { "to": "you@example.com" }, or set ADMIN_EMAILS.' },
      { status: 400 }
    );
  }

  const keys = body.template ? [body.template] : TEMPLATE_KEYS;
  const results = [];

  for (const key of keys) {
    const message = build(key);
    if (!message) {
      results.push({ template: key, ok: false, error: 'unknown template' });
      continue;
    }

    // Prefixed so a test never gets mistaken for the real thing in an inbox.
    const result = await sendEmail({
      to,
      subject: `[TEST] ${message.subject}`,
      html: message.html,
      text: message.text,
      // The roster spreadsheet rides along on the admin templates, and a test
      // that quietly drops it cannot tell you the attachment is broken.
      attachments: message.attachments,
    });
    results.push({ template: key, ...result });
  }

  return NextResponse.json({
    to,
    sent: results.filter((r) => r.ok).length,
    of: results.length,
    results,
  });
}

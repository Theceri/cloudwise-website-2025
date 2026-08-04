import { COMPANY_INFO, SITE_URL, whatsappLink } from '@/lib/constants';
import { isCardPaymentEnabled } from '@/lib/payments/paystack';
import {
  TRACK_WBH,
  TRACKS,
  describeSchedule,
  formatKes,
  formatDay,
  getTrack,
} from '@/lib/training';
import {
  PROMPT_FRAMEWORK,
  PROMPT_LIBRARY,
  READINESS_ACCOUNTS,
  READINESS_STEPS,
  WARM_UP_PROMPTS,
  resourceIntro,
  whatToBring,
} from '@/lib/resources';

import { rosterAttachment } from './roster-csv';
import {
  button,
  codeBlock,
  detailTable,
  emailShell,
  escapeHtml,
  heading,
  highlight,
  htmlToText,
  list,
  paragraph,
} from './layout';

/**
 * Every message in the registration → payment → training lifecycle.
 *
 * Each builder returns `{ subject, html, text }`, ready to hand to sendEmail.
 * The voice follows the Women Biz360 follow-up playbook: warm, specific, one
 * clear action per message, value before the ask.
 */

const url = (path) => `${SITE_URL}${path}`;

function fullName(reg) {
  return [reg.firstName, reg.lastName].filter(Boolean).join(' ').trim() || 'there';
}

function firstName(reg) {
  return reg.firstName?.trim() || 'there';
}

function finish({ title, preheader, bodyHtml, footerNote, subject, kicker, attachments }) {
  const html = emailShell({ title, preheader, bodyHtml, footerNote, kicker });
  return {
    subject: subject || title,
    html,
    text: htmlToText(html),
    ...(attachments?.filter(Boolean).length ? { attachments } : {}),
  };
}

/**
 * The masthead label. The masterclass is co-branded with Women Biz360 Hub, and
 * an attendee who signed up through them should see that, not a Cloudwise-only
 * product name they may not recognise.
 */
function kickerFor(track) {
  return track === TRACK_WBH ? 'Women Biz360 Hub × Cloudwise' : 'AI Productivity Training';
}

/** The event block that appears in almost every message. */
function scheduleRows(reg) {
  const track = getTrack(reg.track);
  const schedule = describeSchedule({ track: reg.track, cohortId: reg.cohortId });
  const isOnline = reg.attendance === 'online';

  return [
    ['Training', escapeHtml(track?.name || 'AI training')],
    ['Dates', escapeHtml(schedule.headline)],
    ['Time', escapeHtml(schedule.detail.split('·')[0].trim())],
    [
      'Where',
      isOnline
        ? 'Online via Zoom — joining link sent the day before'
        : escapeHtml(track?.venue || COMPANY_INFO.address.line1),
    ],
    ['Your reference', `<code>${escapeHtml(reg.reference)}</code>`],
  ];
}

// ---------------------------------------------------------------------------
// 1. Registration received — sent the moment the form is submitted
// ---------------------------------------------------------------------------

export function registrationReceived({ registration: reg, paybill }) {
  const track = getTrack(reg.track);
  const payUrl = url(`/checkout/${reg.reference}`);

  const paymentSteps = paybill
    ? list(
        [
          'Open M-Pesa and choose <strong>Lipa na M-Pesa → Pay Bill</strong>',
          `Business number: <strong>${escapeHtml(paybill.paybill)}</strong>`,
          `Account number: <strong>${escapeHtml(reg.reference)}</strong>`,
          `Amount: <strong>${escapeHtml(formatKes(reg.amount))}</strong>`,
          'Enter your M-Pesa PIN and confirm',
        ],
        { ordered: true }
      )
    : '';

  const bodyHtml = `
    ${heading(`You’re nearly in, ${escapeHtml(firstName(reg))}`, 1)}
    ${paragraph(
      `We’ve saved your place on the <strong>${escapeHtml(track?.name || 'training')}</strong>. It’s confirmed the moment payment comes through — seats are limited and we release unpaid places, so it’s worth doing now.`
    )}
    ${detailTable([...scheduleRows(reg), ['Amount due', escapeHtml(formatKes(reg.amount))]])}
    ${button(`Pay ${formatKes(reg.amount)} now`, payUrl)}
    ${paragraph(
      isCardPaymentEnabled()
        ? 'You can pay by M-Pesa or by card on that page.'
        : 'We’ll send a payment request straight to your phone — just enter your M-Pesa PIN.'
    )}
    ${
      // Only when the paybill fallback is switched on. Printing a paybill we are
      // not reliably notified about turns a helpful alternative into a way to
      // lose someone's money.
      paybill
        ? highlight(
            'Prefer to pay directly from M-Pesa?',
            `${paymentSteps}<p style="margin:6px 0 0;">Use exactly that account number — it’s how we match your payment to your seat automatically.</p>`
          )
        : ''
    }
    ${paragraph(
      `Any questions at all, just reply to this email or <a href="${whatsappLink(
        `Hi Cloudwise, I've registered for the training (ref ${reg.reference}) and have a question.`
      )}" style="color:#FF3F1A;">message us on WhatsApp</a>. We read every message.`
    )}
  `;

  return finish({
    subject: `Almost there — complete your ${track?.shortName || 'training'} booking`,
    title: 'Complete your booking',
    preheader: `Your place is held. Pay ${formatKes(reg.amount)} to confirm it.`,
    kicker: kickerFor(reg.track),
    bodyHtml,
    footerNote:
      'You’re receiving this because you registered for a Cloudwise training. If that wasn’t you, just ignore this email.',
  });
}

// ---------------------------------------------------------------------------
// 2. Payment confirmed — the receipt and the "you're in" moment
// ---------------------------------------------------------------------------

export function paymentConfirmed({ registration: reg }) {
  const intro = resourceIntro({ track: reg.track, cohortId: reg.cohortId });
  const bring = whatToBring({ track: reg.track, attendance: reg.attendance });

  const bodyHtml = `
    ${heading(`You’re in, ${escapeHtml(firstName(reg))} 🎉`, 1)}
    ${paragraph(escapeHtml(intro.body))}
    ${detailTable([
      ...scheduleRows(reg),
      ['Paid', escapeHtml(formatKes(reg.amount))],
      ['Receipt', `<code>${escapeHtml(reg.paymentReceipt || '—')}</code>`],
    ])}
    ${heading('Bring these with you')}
    ${list(bring.map(escapeHtml))}
    ${highlight(
      'A little homework — optional, but it changes your day',
      'Write down the three tasks that eat most of your week. We turn <em>your</em> list into AI shortcuts on the day, rather than working through made-up examples.'
    )}
    ${paragraph('Your full preparation pack — the accounts to open and the warm-up exercises — lands in your inbox shortly. Everything is also here:')}
    ${button('Open your resources', url('/resources'))}
    ${paragraph('If anything changes, just reply to this email and let us know.')}
    ${paragraph(`<strong>${escapeHtml(intro.signoff)}</strong><br><span style="color:#5B5B62;">${escapeHtml(intro.partner)}</span>`)}
  `;

  return finish({
    subject: 'You’re in! 🎉 Your seat is confirmed',
    title: 'Your seat is confirmed',
    preheader: `Payment received. ${describeSchedule({ track: reg.track, cohortId: reg.cohortId }).headline}.`,
    kicker: kickerFor(reg.track),
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// 3. The welcome pack — the substance
// ---------------------------------------------------------------------------

export function welcomePack({ registration: reg }) {
  const accounts = READINESS_ACCOUNTS.map(
    (a) =>
      `<a href="${a.url}" style="color:#FF3F1A;font-weight:600;">${escapeHtml(a.name)}</a> — ${escapeHtml(a.why)}${
        a.required ? ' <strong>(please open this one before the day)</strong>' : ''
      }`
  );

  const steps = READINESS_STEPS.map(
    (s) => `<strong>${escapeHtml(s.title)}.</strong> ${escapeHtml(s.detail)}`
  );

  const framework = PROMPT_FRAMEWORK.parts
    .map((p) => `<strong>${escapeHtml(p.label)}</strong> — ${escapeHtml(p.example)}`)
    .join('<br>');

  const warmUps = WARM_UP_PROMPTS.map(
    (w) => `${heading(w.title, 3)}${codeBlock(w.prompt)}${paragraph(escapeHtml(w.note))}`
  ).join('');

  const samplePrompts = PROMPT_LIBRARY.slice(0, 3)
    .map(
      (p) =>
        `${heading(`${p.n}. ${p.title}`, 3)}${paragraph(
          `<em>${escapeHtml(p.useWhen)}</em>`
        )}${codeBlock(p.prompt)}`
    )
    .join('');

  const bodyHtml = `
    ${heading('Your preparation pack', 1)}
    ${paragraph(
      `Everything below takes about twenty minutes and it is the difference between watching on the day and building on the day. Please do it before we meet.`
    )}

    ${heading('1. Open these accounts')}
    ${list(accounts)}

    ${heading('2. Come prepared')}
    ${list(steps, { ordered: true })}

    ${heading('3. Learn the one thing that makes AI useful')}
    ${paragraph(escapeHtml(PROMPT_FRAMEWORK.intro))}
    ${highlight(PROMPT_FRAMEWORK.title, framework)}
    ${paragraph(escapeHtml(PROMPT_FRAMEWORK.rule))}
    ${paragraph(`<strong>One safety rule.</strong> ${escapeHtml(PROMPT_FRAMEWORK.safety)}`)}

    ${heading('4. Your 15-minute warm-up')}
    ${warmUps}

    ${heading('A taste of your prompt library')}
    ${paragraph('Three from the pack of ten — the rest are on your resources page, yours to keep.')}
    ${samplePrompts}
    ${button('See all ten prompts', url('/resources/prompt-pack'))}

    ${paragraph('Try just one this week and reply to tell us how it went. We read every message.')}
  `;

  return finish({
    subject: 'Your AI preparation pack (20 minutes, before the day)',
    title: 'Your preparation pack',
    preheader: 'The accounts to open, the warm-up, and your first three prompts.',
    kicker: kickerFor(reg.track),
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// 4. Reminders
// ---------------------------------------------------------------------------

export function reminder({ registration: reg, daysOut }) {
  const bring = whatToBring({ track: reg.track, attendance: reg.attendance });
  const isTomorrow = daysOut <= 1;
  const track = getTrack(reg.track);
  const startLabel = formatDay(reg.startDate, { long: true });

  const bodyHtml = `
    ${heading(isTomorrow ? `See you tomorrow, ${escapeHtml(firstName(reg))}` : `Not long now, ${escapeHtml(firstName(reg))}`, 1)}
    ${paragraph(
      isTomorrow
        ? `Your ${escapeHtml(track?.shortName || 'training')} is <strong>tomorrow</strong>. Here is everything you need.`
        : `Your ${escapeHtml(track?.shortName || 'training')} starts on <strong>${escapeHtml(startLabel)}</strong> — ${daysOut} days away. A quick nudge so nothing catches you out.`
    )}
    ${detailTable(scheduleRows(reg))}
    ${heading('What to bring')}
    ${list(bring.map(escapeHtml))}
    ${
      isTomorrow
        ? highlight(
            'Two minutes tonight',
            'Check you can sign in to <a href="https://claude.ai" style="color:#FF3F1A;">claude.ai</a>, and charge your laptop. Password resets in the morning cost you the best part of the first session.'
          )
        : highlight(
            'If you have not done the warm-up yet',
            `It takes fifteen minutes and makes the whole day land differently. <a href="${url('/resources/ai-readiness')}" style="color:#FF3F1A;">Open the readiness guide</a>.`
          )
    }
    ${paragraph(
      `If you can no longer make it, please reply and tell us — we will offer your seat to someone on the waiting list, and sort you out for a later date.`
    )}
  `;

  return finish({
    subject: isTomorrow ? 'See you tomorrow 💛 (what to bring)' : `${daysOut} days to go — your AI training`,
    title: 'Training reminder',
    preheader: isTomorrow
      ? 'Bring your laptop, charger, and one real business task.'
      : `Starts ${startLabel}.`,
    kicker: kickerFor(reg.track),
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// 5. Payment failed — never a dead end
// ---------------------------------------------------------------------------

export function paymentFailed({ registration: reg, reason, paybill }) {
  const payUrl = url(`/checkout/${reg.reference}`);

  const bodyHtml = `
    ${heading('That payment didn’t go through', 1)}
    ${paragraph(
      `No problem — nothing was charged, and your place is still held. ${
        reason ? `M-Pesa said: <em>${escapeHtml(reason)}</em>.` : ''
      }`
    )}
    ${button('Try again', payUrl)}
    ${
      paybill
        ? highlight(
            'Or pay straight from M-Pesa',
            list(
              [
                'Lipa na M-Pesa → Pay Bill',
                `Business number: <strong>${escapeHtml(paybill.paybill)}</strong>`,
                `Account number: <strong>${escapeHtml(reg.reference)}</strong>`,
                `Amount: <strong>${escapeHtml(formatKes(reg.amount))}</strong>`,
              ],
              { ordered: true }
            )
          )
        : ''
    }
    ${paragraph(
      `The usual causes are a wrong number, a cancelled prompt, or not enough balance. If none of those fit, reply and we will sort it out with you.`
    )}
  `;

  return finish({
    subject: 'Your payment didn’t go through — your place is still held',
    title: 'Payment unsuccessful',
    preheader: 'Nothing was charged. Here are two ways to complete it.',
    kicker: kickerFor(reg.track),
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// 6. After the training
// ---------------------------------------------------------------------------

export function completionPack({ registration: reg }) {
  const bodyHtml = `
    ${heading(`That’s a wrap, ${escapeHtml(firstName(reg))}`, 1)}
    ${paragraph(
      'Thank you for the energy you brought. Here is everything to take with you — the point is what you use on Monday, not what you saw on the day.'
    )}
    ${heading('Your toolkit')}
    ${list([
      `<a href="${url('/resources/prompt-pack')}" style="color:#FF3F1A;font-weight:600;">Your full prompt library</a> — all ten prompts with the follow-up lines`,
      `<a href="${url('/resources/ai-readiness')}" style="color:#FF3F1A;font-weight:600;">The four-part framework</a> — the one habit worth more than any tool`,
      'Your session workbook and any documents we built together',
      'The Cloudwise AI WhatsApp support group — ask anything, any time',
    ])}
    ${highlight(
      'The one thing to do this week',
      'Pick the single task that eats most of your time and run it through AI three times. Habit beats knowledge — the people who feel the difference are the ones who use it in the first seven days.'
    )}
    ${paragraph(
      `Ready to go further? We run private team trainings tailored to your workflows, and we build AI into businesses properly — <a href="${url('/contact')}" style="color:#FF3F1A;">tell us what you are trying to do</a>.`
    )}
    ${paragraph('And if this was useful, telling one other business owner is the kindest thing you could do for us.')}
  `;

  return finish({
    subject: 'Your toolkit, recording and community 🎁',
    title: 'After your training',
    preheader: 'Everything from the session, plus the one thing to do this week.',
    kicker: kickerFor(reg.track),
    bodyHtml,
  });
}

// ---------------------------------------------------------------------------
// Admin notifications
// ---------------------------------------------------------------------------

const ADMIN_COLUMNS = [
  ['Name', (r) => fullName(r)],
  ['Email', (r) => r.email || '—'],
  ['Phone', (r) => r.phone || '—'],
  ['Business', (r) => r.organization || '—'],
  ['Role', (r) => r.jobTitle || '—'],
  ['Format', (r) => (r.attendance === 'online' ? 'Online' : 'In person')],
  ['Status', (r) => (r.status === 'paid' ? `Paid ${formatKes(r.amount)}` : 'Awaiting payment')],
  ['Ref', (r) => r.reference],
];

function rosterTable(rows) {
  if (!rows.length) {
    return `<p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#5B5B62;">Nobody yet.</p>`;
  }

  const head = ADMIN_COLUMNS.map(
    ([label]) =>
      `<th align="left" style="padding:8px 10px;border-bottom:2px solid #E6E6EA;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#5B5B62;">${escapeHtml(label)}</th>`
  ).join('');

  const body = rows
    .map((r, i) => {
      const cells = ADMIN_COLUMNS.map(
        ([, get]) =>
          `<td style="padding:9px 10px;border-bottom:1px solid #EFEFF3;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#2B2B31;vertical-align:top;">${escapeHtml(get(r))}</td>`
      ).join('');
      return `<tr style="background:${i % 2 ? '#FAFAFC' : '#FFFFFF'};">${cells}</tr>`;
    })
    .join('');

  return `
    <div style="overflow-x:auto;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;border-collapse:collapse;">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/** Extra profiling answers, shown only for the newest signup. */
function profileBlock(reg) {
  const rows = [
    reg.city && ['City', escapeHtml(reg.city)],
    reg.industry && ['Industry', escapeHtml(reg.industry)],
    reg.aiExperience && ['AI experience', escapeHtml(reg.aiExperience)],
    reg.aiTools?.length && ['Tools used', escapeHtml(reg.aiTools.join(', '))],
    reg.timeConsumingTasks?.length && ['Time goes to', escapeHtml(reg.timeConsumingTasks.join(', '))],
    reg.biggestChallenge && ['Biggest challenge', escapeHtml(reg.biggestChallenge)],
    reg.goal && ['Wants from training', escapeHtml(reg.goal)],
    reg.liveChallenge && ['Task to solve live', escapeHtml(reg.liveChallenge)],
    reg.dietary && ['Dietary / access', escapeHtml(reg.dietary)],
    reg.referralSource && ['Heard about us via', escapeHtml(reg.referralSource)],
    ['WhatsApp updates', reg.whatsappOptIn ? 'Yes' : 'No'],
  ].filter(Boolean);

  return rows.length ? detailTable(rows) : '';
}

/**
 * Group a roster the way the admins think about it: the masterclass on its own,
 * then the individual track split by cohort.
 */
export function groupRoster(registrations) {
  const groups = [];

  const wbh = registrations.filter((r) => r.track === TRACK_WBH);
  if (wbh.length) {
    groups.push({
      key: TRACK_WBH,
      title: `${TRACKS[TRACK_WBH].name} · ${formatDay(TRACKS[TRACK_WBH].eventDate)}`,
      rows: wbh,
    });
  }

  const byCohort = new Map();
  for (const r of registrations) {
    if (r.track === TRACK_WBH) continue;
    const key = r.cohortId || 'unassigned';
    if (!byCohort.has(key)) byCohort.set(key, []);
    byCohort.get(key).push(r);
  }

  for (const [cohortId, rows] of [...byCohort.entries()].sort()) {
    groups.push({
      key: cohortId,
      title: `AI Productivity Training · ${rows[0]?.cohortLabel || cohortId}`,
      rows,
    });
  }

  return groups;
}

function rosterSection(groups) {
  return groups
    .map((g) => {
      const paid = g.rows.filter((r) => r.status === 'paid');
      const revenue = paid.reduce((sum, r) => sum + Number(r.amount || 0), 0);
      return `
        ${heading(g.title)}
        ${paragraph(
          `<strong>${g.rows.length}</strong> registered · <strong>${paid.length}</strong> paid · <strong>${escapeHtml(formatKes(revenue))}</strong> collected`
        )}
        ${rosterTable(g.rows)}`;
    })
    .join('');
}

/** Fires on every signup and every payment, with the full roster attached. */
export function adminSignupAlert({ registration: reg, roster, event }) {
  const track = getTrack(reg.track);
  const isPayment = event === 'paid';
  const where =
    reg.track === TRACK_WBH
      ? formatDay(TRACKS[TRACK_WBH].eventDate)
      : reg.cohortLabel || 'no cohort';

  const bodyHtml = `
    ${heading(isPayment ? '💰 Payment received' : '📝 New registration', 1)}
    ${paragraph(
      `<strong>${escapeHtml(fullName(reg))}</strong> ${
        isPayment
          ? `has paid <strong>${escapeHtml(formatKes(reg.amount))}</strong> for`
          : 'has registered for'
      } <strong>${escapeHtml(track?.name || reg.track)}</strong> — ${escapeHtml(where)}.`
    )}
    ${detailTable([
      ['Name', escapeHtml(fullName(reg))],
      ['Email', `<a href="mailto:${escapeHtml(reg.email)}">${escapeHtml(reg.email)}</a>`],
      ['Phone', escapeHtml(reg.phone || '—')],
      ['Business', escapeHtml(reg.organization || '—')],
      ['Format', reg.attendance === 'online' ? 'Online' : 'In person'],
      ['Reference', `<code>${escapeHtml(reg.reference)}</code>`],
      isPayment && ['Paid with', escapeHtml(reg.paymentMethod || '—')],
      isPayment && ['Receipt', `<code>${escapeHtml(reg.paymentReceipt || '—')}</code>`],
      isPayment && [
        'Bank settlement',
        escapeHtml(reg.settlementState || 'not started'),
      ],
    ])}
    ${profileBlock(reg)}
    ${heading('Everyone signed up right now')}
    ${paragraph(
      'The full list is attached as a spreadsheet — every field, including the profiling answers, ready to sort and filter.'
    )}
    ${rosterSection(groupRoster(roster))}
    ${button('Open the Studio', url('/studio'))}
  `;

  return finish({
    subject: `${isPayment ? '💰 Paid' : '📝 Signup'}: ${fullName(reg)} — ${track?.shortName || reg.track} (${where})`,
    title: isPayment ? 'Payment received' : 'New registration',
    preheader: `${fullName(reg)} · ${where} · ${formatKes(reg.amount)}`,
    bodyHtml,
    attachments: [rosterAttachment(roster)],
  });
}

/** The 5pm East Africa Time round-up. */
export function adminDailyDigest({ roster, todaysSignups, dateLabel }) {
  const paidToday = todaysSignups.filter((r) => r.status === 'paid');
  const revenueToday = paidToday.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalPaid = roster.filter((r) => r.status === 'paid');
  const totalRevenue = totalPaid.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const awaiting = roster.filter((r) => r.status === 'pending');

  const bodyHtml = `
    ${heading('Training round-up', 1)}
    ${paragraph(`<strong>${escapeHtml(dateLabel)}</strong> · 5:00pm East Africa Time`)}

    ${detailTable([
      ['Signed up today', `${todaysSignups.length}`],
      ['Paid today', `${paidToday.length} · ${escapeHtml(formatKes(revenueToday))}`],
      ['Awaiting payment', `${awaiting.length}`],
      ['Paid, all time', `${totalPaid.length} · ${escapeHtml(formatKes(totalRevenue))}`],
    ])}

    ${
      todaysSignups.length
        ? `${heading('Today’s signups')}${rosterTable(todaysSignups)}`
        : paragraph('No new signups today.')
    }

    ${heading('Full roster')}
    ${paragraph(
      'Attached as a spreadsheet too — every field we hold, ready to sort, filter and mail-merge.'
    )}
    ${rosterSection(groupRoster(roster))}

    ${
      awaiting.length
        ? highlight(
            'Worth a nudge',
            `${awaiting.length} ${awaiting.length === 1 ? 'person has' : 'people have'} registered but not paid. A short WhatsApp usually converts a good share of them.`
          )
        : ''
    }

    ${button('Open the Studio', url('/studio'))}
  `;

  return finish({
    subject: `Training round-up — ${dateLabel} (${todaysSignups.length} new, ${formatKes(revenueToday)} collected)`,
    title: 'Daily training round-up',
    preheader: `${todaysSignups.length} new signups · ${formatKes(revenueToday)} collected today.`,
    bodyHtml,
    attachments: [rosterAttachment(roster)],
  });
}

/** Sent when a bank sweep fails, so nobody discovers it from a statement. */
export function adminSettlementFailed({ payment, message }) {
  const bodyHtml = `
    ${heading('⚠️ Bank settlement failed', 1)}
    ${paragraph(
      'The money is safe — it is still sitting in the collection account. Only the automatic transfer to the bank did not go through.'
    )}
    ${detailTable([
      ['Registration', `<code>${escapeHtml(payment.registrationRef)}</code>`],
      ['Amount', escapeHtml(formatKes(payment.amount))],
      ['Rail', escapeHtml(payment.settlementAdapter || '—')],
      ['Reason', escapeHtml(message || payment.settlementMessage || 'unknown')],
    ])}
    ${paragraph('It will be retried automatically on the next scheduled run. If it keeps failing, check the initiator credentials and the destination account number.')}
  `;

  return finish({
    subject: `⚠️ Settlement failed — ${payment.registrationRef} (${formatKes(payment.amount)})`,
    title: 'Settlement failed',
    preheader: 'Funds are safe in the collection account; the transfer needs attention.',
    bodyHtml,
  });
}

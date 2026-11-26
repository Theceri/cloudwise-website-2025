import { SITE_URL } from '@/lib/constants';
import { creditHandoff, groupRoster } from '@/lib/email/templates';
import { latestFirst } from '@/lib/email/roster-csv';
import { TRACK_WBH, TRACKS, formatDay, formatKes, getTrack } from '@/lib/training';

/**
 * The WhatsApp version of every admin alert about the AI courses.
 *
 * Each one carries the same facts as its email, cut down to what reads well on a
 * phone: the event, the person, the money and the next step. The full roster
 * stays in the email and its spreadsheet; WhatsApp gets the totals.
 *
 * WhatsApp formatting: *bold*, _italic_. Phone numbers and links become tappable.
 */

const STUDIO = `${SITE_URL}/studio`;

/**
 * The text is built before the alert is sent, inside the payment flow. A builder
 * that throws on an odd booking must not break that flow, so it returns null
 * instead and sendToAdmins falls back to the email's subject and plain text.
 */
function safe(name, build) {
  return (args) => {
    try {
      return build(args);
    } catch (err) {
      console.error(`[whatsapp] could not build the ${name} alert:`, err?.message);
      return null;
    }
  };
}

/**
 * Join the lines that have something in them. `[label, value]` becomes
 * "label: value"; a falsy row (from `cond && row`) is dropped.
 */
function lines(...rows) {
  return rows
    .filter((row) => Array.isArray(row) || Boolean(row))
    .map((row) => (Array.isArray(row) ? `${row[0]}: ${row[1] ?? '—'}` : row))
    .join('\n');
}

function blocks(...parts) {
  return parts.filter(Boolean).join('\n\n');
}

const shorten = (value, max = 220) => {
  const text = String(value || '').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

const fullName = (r) => [r.firstName, r.lastName].filter(Boolean).join(' ').trim() || 'Someone';

/** "254712345678" → "+254712345678", which WhatsApp turns into a tappable number. */
const phone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits ? `+${digits}` : '—';
};

function whereOf(reg) {
  return reg.track === TRACK_WBH ? formatDay(TRACKS[TRACK_WBH].eventDate) : reg.cohortLabel || 'no cohort';
}

/** One line per training, the latest first: registered, paid, collected. */
function trainingTotals(roster, limit = 4) {
  const groups = groupRoster(roster || []);
  if (!groups.length) return null;

  const rows = groups.slice(0, limit).map((g) => {
    const paid = g.rows.filter((r) => r.status === 'paid');
    const revenue = paid.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    return `• ${g.title}: ${g.rows.length} registered, ${paid.length} paid, ${formatKes(revenue)}`;
  });
  if (groups.length > limit) {
    rows.push(`• and ${groups.length - limit} earlier ${groups.length - limit === 1 ? 'training' : 'trainings'}`);
  }
  return lines('*Signed up right now*', ...rows);
}

/** Fires on every signup and every payment. */
function buildSignupAlert({ registration: reg, roster, event, credit }) {
  const track = getTrack(reg.track);
  const isPayment = event === 'paid';
  const handoff = creditHandoff(reg, credit);
  const utm = reg.utm
    ? [reg.utm.utm_source, reg.utm.utm_campaign, reg.utm.utm_content].filter(Boolean).join(' · ')
    : '';

  return blocks(
    lines(
      isPayment ? '💰 *Payment received*' : '📝 *New registration*',
      reg.teamLead && `🏢 *TEAM LEAD: ${reg.headcount || '?'} people. Follow up today.*`
    ),
    `*${fullName(reg)}* ${
      isPayment ? `paid *${formatKes(reg.amount)}* for` : 'registered for'
    } *${track?.name || reg.track}* (${whereOf(reg)}).`,
    lines(
      ['Phone', phone(reg.phone)],
      ['Email', reg.email],
      ['Business', reg.organization || '—'],
      ['Role', reg.jobTitle || null],
      ['Format', reg.attendance === 'online' ? 'Online' : 'In person'],
      ['Ref', reg.reference],
      !isPayment && ['Amount due', formatKes(reg.amount)],
      isPayment && ['Paid with', reg.paymentMethod || '—'],
      isPayment && ['Receipt', reg.paymentReceipt || '—'],
      isPayment && ['Bank settlement', reg.settlementState || 'not started'],
      reg.creditApplied && ['Credit used', `${formatKes(reg.creditApplied.amountKes)} (${reg.creditApplied.code})`],
      utm && ['Ad source', utm]
    ),
    handoff &&
      lines(`🎟️ *Credit issued: ${credit.code}*`, `Send it to ${reg.firstName || 'them'} (message ready):`, handoff.link),
    lines(
      reg.city && ['City', reg.city],
      reg.industry && ['Industry', reg.industry],
      reg.aiExperience && ['AI experience', reg.aiExperience],
      reg.aiTools?.length && ['Tools used', reg.aiTools.join(', ')],
      reg.timeConsumingTasks?.length && ['Time goes to', shorten(reg.timeConsumingTasks.join(', '))],
      reg.biggestChallenge && ['Biggest challenge', shorten(reg.biggestChallenge)],
      reg.goal && ['Wants', shorten(reg.goal)],
      reg.liveChallenge && ['Task to solve live', shorten(reg.liveChallenge)],
      reg.dietary && ['Dietary / access', reg.dietary],
      reg.referralSource && ['Heard via', reg.referralSource],
      ['WhatsApp updates', reg.whatsappOptIn ? 'Yes' : 'No']
    ),
    trainingTotals(roster),
    `Full roster in the email. Studio: ${STUDIO}`
  );
}

/** The 5pm East Africa Time round-up. */
function buildDailyDigest({ roster, todaysSignups, dateLabel, unmatched = [] }) {
  const paidToday = todaysSignups.filter((r) => r.status === 'paid');
  const revenueToday = paidToday.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalPaid = roster.filter((r) => r.status === 'paid');
  const totalRevenue = totalPaid.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const awaiting = roster.filter((r) => r.status === 'pending');

  const today = latestFirst(todaysSignups).slice(0, 15);

  return blocks(
    lines('📊 *Training round-up*', `${dateLabel} · 5:00pm EAT`),
    lines(
      ['Signed up today', todaysSignups.length],
      ['Paid today', `${paidToday.length} · ${formatKes(revenueToday)}`],
      ['Awaiting payment', awaiting.length],
      ['Paid, all time', `${totalPaid.length} · ${formatKes(totalRevenue)}`]
    ),
    unmatched.length &&
      lines(
        `⚠️ *${unmatched.length} paybill ${unmatched.length === 1 ? 'payment' : 'payments'} to match*`,
        ...unmatched.map(
          (p) =>
            `• ${formatKes(p.amount)} · code ${p.externalId} · account "${p.registrationRef || ''}" · ${(p.createdAt || '').slice(0, 10)}`
        ),
        'Match them before the class.'
      ),
    today.length
      ? lines(
          '*Today’s signups*',
          ...today.map(
            (r) =>
              `• ${fullName(r)} · ${getTrack(r.track)?.shortName || r.track} · ${
                r.status === 'paid' ? `paid ${formatKes(r.amount)}` : 'awaiting payment'
              } · ${phone(r.phone)}`
          ),
          todaysSignups.length > today.length && `• and ${todaysSignups.length - today.length} more`
        )
      : 'No new signups today.',
    trainingTotals(roster),
    awaiting.length &&
      `👉 ${awaiting.length} ${awaiting.length === 1 ? 'person has' : 'people have'} registered but not paid. A short WhatsApp usually converts a good share of them.`,
    `Full roster in the email. Studio: ${STUDIO}`
  );
}

/** A bank sweep failed. */
function buildSettlementFailed({ payment, message }) {
  return blocks(
    '⚠️ *Bank settlement failed*',
    'The money is safe in the collection account. Only the automatic transfer to the bank did not go through.',
    lines(
      ['Registration', payment.registrationRef],
      ['Amount', formatKes(payment.amount)],
      ['Rail', payment.settlementAdapter || '—'],
      ['Reason', message || payment.settlementMessage || 'unknown']
    ),
    'It retries on the next scheduled run. If it keeps failing, check the initiator credentials and the destination account number.'
  );
}

/** A team or private training enquiry from /ai-training/teams. */
function buildTeamEnquiry({ enquiry, utm }) {
  return blocks(
    `🏢 *Team training enquiry*`,
    `*${enquiry.name}* asked about ${enquiry.format} training for *${enquiry.organization}* (${enquiry.teamSize} people). Call the same day.`,
    lines(
      ['Phone', phone(enquiry.phone)],
      ['Email', enquiry.email],
      ['Role', enquiry.role || '—'],
      ['Preferred month', enquiry.preferredMonth || '—'],
      utm && ['Ad source', utm]
    ),
    enquiry.message && `“${shorten(enquiry.message, 600)}”`,
    `Studio: ${STUDIO}`
  );
}

/** The buyer typed an M-Pesa code at checkout: someone needs to check the statement. */
function buildPaybillClaim({ registration: reg, receipt, link }) {
  return blocks(
    '🧾 *Says they paid: check the paybill*',
    `*${fullName(reg)}* says they paid *${formatKes(reg.amount)}* to the paybill for ${reg.cohortLabel || getTrack(reg.track)?.name || reg.track}.`,
    lines(['M-Pesa code', receipt], ['Phone', phone(reg.phone)], ['Ref', reg.reference]),
    lines(
      'Find the code on the paybill statement (M-Pesa Business app or Org portal). If it is there and the amount is right, confirm the seat:',
      link
    ),
    'If Safaricom’s confirmation arrives first, the seat confirms by itself.'
  );
}

/** A paybill payment that could not be matched to a booking with certainty. */
function buildPaybillUnmatched({ payment, candidates = [] }) {
  return blocks(
    `⚠️ *Paybill payment to match: ${formatKes(payment.amount)}*`,
    lines(
      ['From', payment.payerName || 'unknown'],
      ['M-Pesa code', payment.transactionId],
      ['Account typed', payment.typedReference || '(blank)']
    ),
    candidates.length
      ? lines(
          '*Likely bookings.* Tap the right one. The page asks you to confirm before anything happens.',
          ...candidates.map(
            ({ registration: r, why, link }, i) =>
              `${i + 1}. ${fullName(r)} · ${r.reference} · ${formatKes(r.amount)} · ${phone(r.phone)}\n   Matches on ${why?.join(' and ') || 'amount only'}\n   ${link}`
          )
        )
      : 'No unpaid booking is a likely match. Ask the payer on WhatsApp to book at cloudwise.co.ke/ai-training, then use “I have already paid” at checkout with this M-Pesa code.',
    'It stays in the 5pm round-up until it is matched.'
  );
}

/** A paybill payment without a booking reference, matched automatically. */
function buildPaybillAutoMatched({ registration: reg, payment, matchedHow }) {
  return blocks(
    `💰 *Paybill payment matched: ${formatKes(payment.amount)}*`,
    `Matched to *${fullName(reg)}* (${reg.reference}) by ${matchedHow}. The seat is confirmed and their emails are on the way.`,
    lines(
      ['M-Pesa code', payment.transactionId],
      ['Account typed', payment.typedReference || '(blank)'],
      ['M-Pesa name', payment.payerName || 'unknown']
    ),
    `If this is the wrong person, open the payment in the Studio: ${STUDIO}`
  );
}

/** Less than the booking price arrived. The seat is not confirmed. */
function buildPartPayment({ registration: reg, payment }) {
  return blocks(
    `⚠️ *Part payment: ${fullName(reg)}*`,
    `Paid *${formatKes(payment.amount)}* against a booking of ${formatKes(reg.amount)}. The seat is *not* confirmed.`,
    lines(
      ['Still owing', formatKes(Number(reg.amount) - Number(payment.amount))],
      ['M-Pesa code', payment.transactionId],
      ['Ref', reg.reference],
      ['Phone', phone(reg.phone)],
      ['Email', reg.email]
    ),
    `Accept the part payment or ask for the balance, then confirm it by hand in the Studio: ${STUDIO}`
  );
}

// The public builders, each guarded by `safe`.
export const signupAlert = safe('signupAlert', buildSignupAlert);
export const dailyDigest = safe('dailyDigest', buildDailyDigest);
export const settlementFailed = safe('settlementFailed', buildSettlementFailed);
export const teamEnquiry = safe('teamEnquiry', buildTeamEnquiry);
export const paybillClaim = safe('paybillClaim', buildPaybillClaim);
export const paybillUnmatched = safe('paybillUnmatched', buildPaybillUnmatched);
export const paybillAutoMatched = safe('paybillAutoMatched', buildPaybillAutoMatched);
export const partPayment = safe('partPayment', buildPartPayment);

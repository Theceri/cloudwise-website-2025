import { describeSchedule, formatDay, getTrack } from '@/lib/training';

/**
 * The roster as a spreadsheet, attached to every admin email.
 *
 * The HTML table in the email is for reading; this is for working. It carries
 * every field we hold — including the profiling answers the table has no room
 * for — so filtering by cohort, mail-merging a WhatsApp list or handing the
 * partner their attendees is a sort and a filter rather than a copy-paste job.
 *
 * CSV rather than a real .xlsx: Excel opens it natively on a double-click, and
 * writing a genuine xlsx means a zip container and a new dependency for a file
 * that gets one sort and one filter applied to it.
 */

const COLUMNS = [
  ['Reference', (r) => r.reference],
  ['Status', (r) => (r.status === 'paid' ? 'Paid' : 'Awaiting payment')],
  ['Training', (r) => getTrack(r.track)?.name || r.track],
  ['Cohort', (r) => r.cohortLabel || r.cohortId || ''],
  ['Dates', (r) => describeSchedule({ track: r.track, cohortId: r.cohortId }).headline],
  ['Starts', (r) => (r.startDate ? formatDay(r.startDate) : '')],
  ['First name', (r) => r.firstName],
  ['Last name', (r) => r.lastName],
  ['Email', (r) => r.email],
  ['Phone', (r) => r.phone],
  ['Business', (r) => r.organization],
  ['Role', (r) => r.jobTitle],
  ['City', (r) => r.city],
  ['Industry', (r) => r.industry],
  ['Format', (r) => (r.attendance === 'online' ? 'Online' : 'In person')],
  ['AI experience', (r) => r.aiExperience],
  ['Tools used', (r) => r.aiTools],
  ['Time goes to', (r) => r.timeConsumingTasks],
  ['Biggest challenge', (r) => r.biggestChallenge],
  ['Wants from training', (r) => r.goal],
  ['Task to solve live', (r) => r.liveChallenge],
  ['Dietary / access', (r) => r.dietary],
  ['Heard about us via', (r) => r.referralSource],
  ['WhatsApp updates', (r) => (r.whatsappOptIn ? 'Yes' : 'No')],
  ['Amount', (r) => r.amount],
  ['Paid with', (r) => r.paymentMethod],
  ['Receipt', (r) => r.paymentReceipt],
  ['Paid at', (r) => isoToLocal(r.paidAt)],
  ['Bank settlement', (r) => r.settlementState],
  ['Registered at', (r) => isoToLocal(r.createdAt)],
];

/** Timestamps read in Nairobi time — nobody reconciling this thinks in UTC. */
function isoToLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d
    .toLocaleString('en-GB', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
}

/**
 * One CSV cell.
 *
 * The leading-quote guard matters: these are free-text answers typed by the
 * public, and a spreadsheet treats a value starting `=`, `+`, `-` or `@` as a
 * formula to execute. Prefixing an apostrophe keeps it text.
 */
function cell(value) {
  if (value === null || value === undefined) return '';

  let text = Array.isArray(value) ? value.join('; ') : String(value);
  text = text.replace(/\r\n?/g, '\n').trim();
  if (!text) return '';

  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;

  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** The roster as CSV text, header row first. */
export function rosterCsv(registrations = []) {
  const rows = [COLUMNS.map(([label]) => cell(label)).join(',')];

  for (const r of registrations) {
    rows.push(COLUMNS.map(([, get]) => cell(get(r))).join(','));
  }

  // A BOM, so Excel reads it as UTF-8 and does not mangle names with accents.
  return `﻿${rows.join('\r\n')}\r\n`;
}

/**
 * The roster as a Resend attachment, or nothing at all when there is nobody on
 * it — an empty spreadsheet is noise on every alert.
 */
export function rosterAttachment(registrations = [], { label } = {}) {
  if (!registrations.length) return null;

  const day = new Date().toISOString().slice(0, 10);
  const suffix = label ? `-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '';

  return {
    filename: `cloudwise-registrations${suffix}-${day}.csv`,
    content: Buffer.from(rosterCsv(registrations), 'utf8').toString('base64'),
    contentType: 'text/csv',
  };
}

/**
 * Training domain model — tracks, pricing, cohorts and payment references.
 *
 * Three tracks are sold, as a ladder (tiered plan CW-2026-AIT-01 rev4):
 *
 *   kickstart       AI Kickstart. Ksh 500. Two hours live on Google Meet, every
 *                   Wednesday 7:00–9:00pm EAT. Earns a Ksh 500 credit.
 *   essentials      AI Essentials. Ksh 5,500. Four hours, the first Saturday of
 *                   a cohort (it is Day One of the Programme). Earns a Ksh 5,500
 *                   credit toward the Programme.
 *   individual      AI Productivity Programme. Ksh 13,500. Rolling monthly
 *                   cohorts, two half-day Saturday sessions (1st & 2nd
 *                   Saturday). The id stays "individual" because every
 *                   existing booking uses it.
 *
 * Every class is paid in full, at booking. There are no deposits or
 * instalments (decided 15 October 2026): part payments invite buyers who will
 * not pay the full price and requests for refunds, and the code is simpler
 * without them.
 *
 * A fourth is retired:
 *
 *   wbh-masterclass Women Biz360 Hub × Cloudwise AI Masterclass. A one-off dated
 *                   event, run on 15 September 2026 and not running again. Its
 *                   landing and registration pages are gone and nothing can
 *                   create a new registration on it — but people paid for it,
 *                   so the track stays readable here. Its records still have to
 *                   render in the Studio, in receipts and in the admin digest.
 *                   Do not delete it; do not sell it.
 *
 * Everything here is pure data + pure functions so it can be imported from
 * server routes, client components and cron jobs alike.
 */

import { formatAddress } from '@/lib/constants';

export const TRACK_INDIVIDUAL = 'individual';
export const TRACK_PROGRAMME = TRACK_INDIVIDUAL;
export const TRACK_KICKSTART = 'kickstart';
export const TRACK_ESSENTIALS = 'essentials';
export const TRACK_WBH = 'wbh-masterclass';

/** The private one-to-one programme: 8 hours, one person. Quoted, not booked online. */
export const PRIVATE_PRICE_KES = 30000;
/** Team training: the Programme rebuilt around a team's own work. */
export const TEAM_PRICE_PER_PERSON_KES = 13500;
export const TEAM_MIN_PEOPLE = 10;

export const TRACKS = {
  [TRACK_KICKSTART]: {
    id: TRACK_KICKSTART,
    tier: 1,
    param: 'kickstart',
    name: 'AI Kickstart',
    shortName: 'Kickstart',
    audience: 'Anyone new to AI',
    priceKes: 500,
    strikePriceKes: null,
    registerPath: '/ai-training/register?tier=kickstart',
    landingPath: '/ai-training/kickstart',
    refLetter: 'K',
    durationLabel: '2 hours · Wednesday 7:00pm–9:00pm EAT',
    lengthLabel: '2 hours',
    formatLabel: 'Live on Google Meet',
    venue: 'Online, on Google Meet',
    supportsOnline: true,
    onlineOnly: true,
    hasCohorts: false,
    hasSessions: true,
    capacity: 100,
    // What the certificate says about the course. See src/lib/certificates.js.
    certificate: {
      hours: 2,
      summary:
        'a two-hour live course in practical AI for work: the R.C.T.F. prompt method, writing, replying to customers and summarising documents with Claude',
    },
    // What a paid booking earns toward a bigger course. See src/lib/credits.js.
    credit: { amountKes: 500, days: 14, appliesTo: ['essentials', 'individual'] },
  },
  [TRACK_ESSENTIALS]: {
    id: TRACK_ESSENTIALS,
    tier: 2,
    param: 'essentials',
    name: 'AI Essentials',
    shortName: 'Essentials',
    audience: 'Professionals and business owners',
    priceKes: 5500,
    strikePriceKes: null,
    registerPath: '/ai-training/register?tier=essentials',
    landingPath: '/ai-training/essentials',
    refLetter: 'E',
    durationLabel: '1 Saturday · 9:00am–1:00pm',
    lengthLabel: '4 hours',
    formatLabel: 'Delta Annex or Google Meet',
    venue: formatAddress(),
    supportsOnline: true,
    hasCohorts: true,
    days: ['day-one'],
    certificate: {
      hours: 4,
      summary:
        'a four-hour practical course in AI for work, including building and testing a personal AI assistant on real work, research with sources and safe use under the Kenya Data Protection Act, 2019',
    },
    credit: { amountKes: 5500, days: 60, appliesTo: ['individual'] },
  },
  [TRACK_INDIVIDUAL]: {
    id: TRACK_INDIVIDUAL,
    tier: 3,
    param: 'programme',
    name: 'AI Productivity Programme',
    shortName: 'Programme',
    audience: 'Individuals & teams',
    priceKes: 13500,
    // No reference price: nobody has ever paid Ksh 30,000 for a cohort seat, so a
    // struck-through anchor would be a misleading price claim. Ksh 30,000 is now
    // the real price of private one-to-one training instead.
    strikePriceKes: null,
    registerPath: '/ai-training/register?tier=programme',
    landingPath: '/ai-training/programme',
    refPrefix: 'CWI', // legacy references only — see generateReference
    refLetter: 'A',
    // Two 4-hour Saturday sessions per cohort.
    durationLabel: '2 Saturdays · 9:00am–1:00pm each',
    lengthLabel: '8 hours',
    formatLabel: 'Delta Annex or Google Meet',
    venue: formatAddress(),
    supportsOnline: true,
    hasCohorts: true,
    days: ['day-one', 'day-two'],
    certificate: {
      hours: 8,
      summary:
        'an eight-hour practical programme in AI for work: prompting, writing, research, data, a personal AI assistant and connected workflows that stop for human approval',
    },
  },
  // Retired — read-only. See the module comment above.
  [TRACK_WBH]: {
    id: TRACK_WBH,
    retired: true,
    name: 'AI Masterclass for Women Entrepreneurs',
    shortName: 'AI Masterclass',
    audience: 'Women Biz360 Hub members',
    partner: 'Women Biz360 Hub',
    priceKes: 7500,
    strikePriceKes: null,
    // No registerPath or landingPath: those pages are gone.
    refPrefix: 'CWW', // legacy references only — see generateReference
    refLetter: 'W',
    durationLabel: 'Full day · 8:30am–4:00pm',
    venue: 'Delta Centre, Waiyaki Way, Nairobi',
    supportsOnline: false,
    hasCohorts: false,
    // Single fixed event.
    eventDate: '2026-09-15',
    eventStart: '08:30',
    eventEnd: '16:00',
  },
};

export const TRACK_IDS = Object.keys(TRACKS);

/** The three public tiers, cheapest first. */
export const PUBLIC_TIERS = [TRACK_KICKSTART, TRACK_ESSENTIALS, TRACK_PROGRAMME];

/**
 * `?tier=` on the register page → a track id. Anything unknown, including the
 * retired masterclass, falls back to the Programme.
 */
export function tierFromParam(value) {
  const match = PUBLIC_TIERS.find((id) => TRACKS[id].param === value || id === value);
  return match || TRACK_PROGRAMME;
}

export function getTrack(trackId) {
  return TRACKS[trackId] || null;
}

/** Does this track exist at all? True for retired tracks, so old records read. */
export function isValidTrack(trackId) {
  return Object.prototype.hasOwnProperty.call(TRACKS, trackId);
}

/** Can someone still book this today? False for retired tracks. */
export function isBookableTrack(trackId) {
  const track = getTrack(trackId);
  return Boolean(track && !track.retired);
}

/** Amount payable, in KES, for a track. Single source of truth for pricing. */
export function priceFor(trackId) {
  const track = getTrack(trackId);
  if (!track) throw new Error(`Unknown track: ${trackId}`);
  return track.priceKes;
}

/**
 * Test mode: charge a token amount instead of the real price.
 *
 * Set TEST_PAYMENT_AMOUNT_KES (e.g. 2) to exercise the whole money path —
 * STK push, C2B confirmation, part payment, settlement — for a few shillings.
 * Two, not one, so paying Ksh 1 to the paybill is a genuine underpayment and
 * the part-payment branch can be tested too.
 *
 * This deliberately does NOT touch `priceKes`, so every marketing and
 * registration page still advertises the real price. It changes only what a
 * registration is actually charged, which is the number the STK push, the
 * paid/part-paid threshold and the checkout total all read.
 *
 * Server-side only — it is read when a registration is created, and the amount
 * is then stored on the record, so nothing downstream needs to know about it.
 *
 * NEVER set this in the production environment.
 */
export function testPaymentAmount() {
  const raw = Number(process.env.TEST_PAYMENT_AMOUNT_KES);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : null;
}

/**
 * What a new registration is actually charged. Use this when creating a
 * registration; use `priceFor` when displaying what the training costs.
 */
export function chargeFor(trackId) {
  const real = priceFor(trackId);
  return testPaymentAmount() ?? real;
}

// ---------------------------------------------------------------------------
// Cohorts
// ---------------------------------------------------------------------------

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/** The first month cohorts are offered for. Nothing earlier is ever listed. */
const COHORT_EPOCH = { year: 2026, month: 8 }; // month is 0-indexed → September 2026

/** Registration closes this many days before day one of a cohort. */
export const COHORT_CLOSE_DAYS_BEFORE = 2;

/**
 * Dates are handled as UTC midnights throughout. Cohort days are whole calendar
 * days, so timezone drift between the server (UTC on Vercel) and Nairobi
 * (UTC+3) would otherwise shift a Saturday onto a Friday.
 */
function utcDate(year, month, day) {
  return new Date(Date.UTC(year, month, day));
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

/** The nth (1-based) occurrence of Saturday in a given month. */
function nthSaturday(year, month, n) {
  const first = utcDate(year, month, 1);
  const offsetToFirstSaturday = (6 - first.getUTCDay() + 7) % 7;
  return utcDate(year, month, 1 + offsetToFirstSaturday + (n - 1) * 7);
}

/**
 * Short form is the compact one used for cohort labels — "Sat 05 Sep 2026".
 * Long form reads like a person wrote it — "Tuesday, 15 September 2026".
 */
export function formatDay(date, { long = false } = {}) {
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00Z`) : date;

  if (long) {
    return (
      `${WEEKDAYS_LONG[d.getUTCDay()]}, ${d.getUTCDate()} ` +
      `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`
    );
  }

  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${WEEKDAYS[d.getUTCDay()]} ${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "08:30" → "8:30am". Times are stored 24-hour so schema.org stays valid. */
export function formatTime(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  if (Number.isNaN(h)) return String(hhmm);
  const suffix = h < 12 ? 'am' : 'pm';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  // Minutes are always shown so a range reads evenly: "8:30am–4:00pm".
  return `${hour12}:${String(m || 0).padStart(2, '0')}${suffix}`;
}

/** Build the cohort that runs in a given year/month. */
function buildCohort(year, month) {
  const dayOne = nthSaturday(year, month, 1);
  const dayTwo = nthSaturday(year, month, 2);
  const closesAt = new Date(dayOne);
  closesAt.setUTCDate(closesAt.getUTCDate() - COHORT_CLOSE_DAYS_BEFORE);

  return {
    id: `${year}-${String(month + 1).padStart(2, '0')}`,
    label: `${formatDay(dayOne)} & ${formatDay(dayTwo)}`,
    monthLabel: `${MONTHS[month]} ${year}`,
    dayOne: isoDay(dayOne),
    dayTwo: isoDay(dayTwo),
    closesAt: isoDay(closesAt),
  };
}

/**
 * Cohorts still open for registration, soonest first.
 *
 * `now` is injectable so cron jobs and tests can ask "what was open on date X".
 */
export function listOpenCohorts({ now = new Date(), count = 6 } = {}) {
  const today = isoDay(now);
  const cohorts = [];

  let year = COHORT_EPOCH.year;
  let month = COHORT_EPOCH.month;

  // Walk forward from the epoch, skipping cohorts whose window has closed.
  // Bounded so a bad clock can never spin here.
  for (let i = 0; i < 120 && cohorts.length < count; i += 1) {
    const cohort = buildCohort(year, month);
    if (cohort.closesAt >= today) cohorts.push(cohort);

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return cohorts;
}

/** Look up a cohort by id, whether or not it is still open. */
export function getCohort(cohortId) {
  const match = /^(\d{4})-(\d{2})$/.exec(cohortId || '');
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  if (year < COHORT_EPOCH.year) return null;
  if (year === COHORT_EPOCH.year && month < COHORT_EPOCH.month) return null;

  return buildCohort(year, month);
}

/** Is this cohort still accepting registrations? */
export function isCohortOpen(cohortId, { now = new Date() } = {}) {
  const cohort = getCohort(cohortId);
  return Boolean(cohort && cohort.closesAt >= isoDay(now));
}

// ---------------------------------------------------------------------------
// Kickstart sessions — every Wednesday, 7:00–9:00pm East Africa Time
// ---------------------------------------------------------------------------

/** The first Kickstart. Nothing earlier is ever listed. */
const KICKSTART_EPOCH = '2026-10-28';
export const KICKSTART_START = '19:00';
export const KICKSTART_END = '21:00';
/** Booking closes at 5:00pm EAT on the day (14:00 UTC), two hours before the start. */
const KICKSTART_CLOSE_UTC_HOUR = 14;

/**
 * Wednesdays that will not run, as ISO dates, from KICKSTART_SKIP_DATES
 * ("2026-12-23,2026-12-30"). Lets a week be cancelled without a code change.
 * Read on the server only; pages pass the resulting list to the browser.
 */
function kickstartSkipDates() {
  const raw = typeof process !== 'undefined' ? process.env.KICKSTART_SKIP_DATES : '';
  return new Set(
    String(raw || '')
      .split(',')
      .map((d) => d.trim())
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  );
}

function buildKickstartSession(date) {
  const iso = isoDay(date);
  const closesAt = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), KICKSTART_CLOSE_UTC_HOUR)
  );
  return {
    // The session id is stored in the registration's `cohortId` field, so the
    // reminder and follow-up machinery works for every track unchanged.
    id: `ks-${iso}`,
    date: iso,
    label: formatDay(date),
    longLabel: formatDay(date, { long: true }),
    closesAt: closesAt.toISOString(),
  };
}

/** The next `count` open Kickstart sessions, soonest first. */
export function listKickstartSessions({ now = new Date(), count = 4 } = {}) {
  const skip = kickstartSkipDates();
  const sessions = [];
  const epoch = new Date(`${KICKSTART_EPOCH}T00:00:00Z`);
  const today = utcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  // Start from whichever is later, the epoch or today, moved on to a Wednesday.
  let cursor = new Date(Math.max(epoch.getTime(), today.getTime()));
  cursor.setUTCDate(cursor.getUTCDate() + ((3 - cursor.getUTCDay() + 7) % 7));

  // Bounded so a bad clock or a long skip list can never spin here.
  for (let i = 0; i < 104 && sessions.length < count; i += 1) {
    const session = buildKickstartSession(cursor);
    if (!skip.has(session.date) && new Date(session.closesAt) > now) sessions.push(session);
    cursor = new Date(cursor);
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }
  return sessions;
}

export function getKickstartSession(sessionId) {
  const match = /^ks-(\d{4}-\d{2}-\d{2})$/.exec(sessionId || '');
  if (!match) return null;
  const date = new Date(`${match[1]}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.getUTCDay() !== 3) return null;
  if (match[1] < KICKSTART_EPOCH) return null;
  return buildKickstartSession(date);
}

export function isKickstartSessionOpen(sessionId, { now = new Date() } = {}) {
  const session = getKickstartSession(sessionId);
  if (!session || kickstartSkipDates().has(session.date)) return false;
  return new Date(session.closesAt) > now;
}

/** Essentials runs on day one of each cohort, so its dates are the cohorts' first Saturdays. */
export function listEssentialsDates({ now = new Date(), count = 3 } = {}) {
  return listOpenCohorts({ now, count }).map((cohort) => ({
    id: cohort.id,
    label: formatDay(cohort.dayOne),
    longLabel: formatDay(cohort.dayOne, { long: true }),
    date: cohort.dayOne,
    closesAt: cohort.closesAt,
  }));
}

/**
 * Open dates for a public tier, in one shape for the pages, the next-dates
 * strip and the Course JSON-LD: { id, label, closesAt, days: [isoDay, ...] }.
 */
export function openDatesFor(trackId, { now = new Date(), count = 3 } = {}) {
  if (trackId === TRACK_KICKSTART) {
    return listKickstartSessions({ now, count }).map((s) => ({
      id: s.id,
      label: s.label,
      closesAt: s.closesAt,
      days: [s.date],
    }));
  }
  if (trackId === TRACK_ESSENTIALS) {
    return listEssentialsDates({ now, count }).map((d) => ({
      id: d.id,
      label: d.label,
      closesAt: d.closesAt,
      days: [d.date],
    }));
  }
  return listOpenCohorts({ now, count }).map((c) => ({
    id: c.id,
    label: c.label,
    closesAt: c.closesAt,
    days: [c.dayOne, c.dayTwo],
  }));
}

/** Is the date a booking names still open, whatever the track? */
export function isBookingDateOpen(trackId, dateId, { now = new Date() } = {}) {
  if (trackId === TRACK_KICKSTART) return isKickstartSessionOpen(dateId, { now });
  return isCohortOpen(dateId, { now });
}

/**
 * The revenue a paid booking represents, for Meta and GA4: the list price less
 * any credit applied. Never the charged `amount`, which in test mode is a token
 * shilling. A credit is counted on the booking that earned it, so subtracting
 * it here keeps the ladder's revenue from being counted twice.
 */
export function reportedValue(registration) {
  const list = Number(registration?.listPrice) || TRACKS[registration?.track]?.priceKes || Number(registration?.amount) || 0;
  return Math.max(list - (Number(registration?.creditApplied?.amountKes) || 0), 0);
}

// ---------------------------------------------------------------------------
// Event summary — one shape both tracks render from
// ---------------------------------------------------------------------------

/**
 * Human-readable schedule for a registration, used in emails, the checkout
 * summary and the admin digest. Weekday names are always derived from the date
 * itself so a wrong day can never be printed.
 */
export function describeSchedule({ track, cohortId, attendsDays }) {
  if (track === TRACK_KICKSTART) {
    const session = getKickstartSession(cohortId);
    return session
      ? {
          headline: session.label,
          detail: `${formatTime(KICKSTART_START)}–${formatTime(KICKSTART_END)} EAT · live on Google Meet`,
          days: [session.date],
        }
      : { headline: 'Date to be confirmed', detail: '', days: [] };
  }

  if (track === TRACK_ESSENTIALS) {
    const cohort = getCohort(cohortId);
    return cohort
      ? {
          headline: formatDay(cohort.dayOne),
          detail: '9:00am–1:00pm · online or at Delta Annex, Westlands',
          days: [cohort.dayOne],
        }
      : { headline: 'Date to be confirmed', detail: '', days: [] };
  }

  // A Programme booking paid with an Essentials credit: Day One is already done.
  if (Array.isArray(attendsDays) && attendsDays.length === 1 && attendsDays[0] === 'day-two') {
    const cohort = getCohort(cohortId);
    return cohort
      ? {
          headline: `Day Two: ${formatDay(cohort.dayTwo)}`,
          detail: '9:00am–1:00pm · Day Two of the Programme',
          days: [cohort.dayTwo],
        }
      : { headline: 'Day Two, date to be confirmed', detail: '', days: [] };
  }

  if (track === TRACK_WBH) {
    const t = TRACKS[TRACK_WBH];
    return {
      headline: formatDay(t.eventDate, { long: true }),
      detail: `${formatTime(t.eventStart)}–${formatTime(t.eventEnd)} · ${t.venue}`,
      days: [t.eventDate],
    };
  }

  const cohort = getCohort(cohortId);
  if (!cohort) return { headline: 'Dates to be confirmed', detail: '', days: [] };

  return {
    headline: cohort.label,
    detail: '9:00am–1:00pm each day · online or in person, Nairobi',
    days: [cohort.dayOne, cohort.dayTwo],
  };
}

/** The first day a registration's training actually starts — drives reminders. */
export function startDateFor({ track, cohortId, attendsDays }) {
  const days = describeSchedule({ track, cohortId, attendsDays }).days;
  return days.length ? days[0] : null;
}

/** The last day of a registration's training — drives the follow-up pack. */
export function endDateFor({ track, cohortId, attendsDays }) {
  const days = describeSchedule({ track, cohortId, attendsDays }).days;
  return days.length ? days[days.length - 1] : null;
}

/** Whole days between today and a training start date. Negative once past. */
export function daysUntil(isoDate, { now = new Date() } = {}) {
  if (!isoDate) return null;
  const target = new Date(`${isoDate}T00:00:00Z`).getTime();
  const today = new Date(`${isoDay(now)}T00:00:00Z`).getTime();
  return Math.round((target - today) / 86400000);
}

// ---------------------------------------------------------------------------
// Payment references
// ---------------------------------------------------------------------------

const REF_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O/1/I — read aloud over the phone

/**
 * The reference a customer types as the M-Pesa account number, and the key
 * every record hangs off. Format: A7F3K2 (Programme), K7F3K2 (Kickstart),
 * E7F3K2 (Essentials) or W7F3K2 (Women Biz360, retired).
 *
 * Six characters, no separator. This is typed on a feature phone keypad by
 * someone standing at a till, so every character is a chance to get it wrong —
 * the old CWI-7F3K2M was ten characters and a hyphen for no benefit the payer
 * cares about. One track letter is kept because it costs a single character and
 * makes a payment identifiable at a glance during reconciliation.
 *
 * 32^5 ≈ 33.5 million per track, so collisions stay negligible well past any
 * plausible number of registrations. (Four random characters would have been
 * about a million, where a couple of thousand bookings already makes a
 * collision likely — hence five.)
 */
const REF_BODY_LENGTH = 5;

export function generateReference(trackId) {
  const prefix = getTrack(trackId)?.refLetter || 'C';
  const bytes = new Uint8Array(REF_BODY_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
  return `${prefix}${body}`;
}

const CURRENT_RE = new RegExp(`^[AWKE][${REF_ALPHABET}]{${REF_BODY_LENGTH}}$`);
// Bookings taken before the reference was shortened. Their documents are stored
// under the hyphenated id, so those must keep resolving forever.
const LEGACY_RE = new RegExp(`^CW[IW][${REF_ALPHABET}]{6}$`);

export const REFERENCE_RE = CURRENT_RE;

/**
 * Turn whatever the customer actually typed into the canonical reference, or
 * null if it cannot be one.
 *
 * Safaricom passes the account number through verbatim, and people type
 * "a7f3k2", "A7F3-K2" or "A7F 3K2". Rejecting those loses a real payment over
 * punctuation, so strip anything that is not a letter or digit before matching
 * and let the shape decide.
 */
export function normaliseReference(input) {
  if (typeof input !== 'string') return null;
  const bare = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (CURRENT_RE.test(bare)) return bare;
  // Legacy ids live in Sanity with the hyphen, so put it back.
  if (LEGACY_RE.test(bare)) return `${bare.slice(0, 3)}-${bare.slice(3)}`;
  return null;
}

export function isValidReference(ref) {
  return normaliseReference(ref) !== null;
}

export function formatKes(amount) {
  return `Ksh ${Number(amount).toLocaleString('en-KE')}`;
}

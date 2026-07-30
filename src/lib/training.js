/**
 * Training domain model — tracks, pricing, cohorts and payment references.
 *
 * Two tracks share one registration → payment → onboarding pipeline:
 *
 *   individual      Cloudwise AI Productivity Training. Rolling monthly cohorts,
 *                   two half-day Saturday sessions (1st & 2nd Saturday).
 *   wbh-masterclass Women Biz360 Hub × Cloudwise AI Masterclass. A single dated
 *                   event; attendees already gave their details at the free
 *                   webinar, so its form only collects what we still need.
 *
 * Everything here is pure data + pure functions so it can be imported from
 * server routes, client components and cron jobs alike.
 */

export const TRACK_INDIVIDUAL = 'individual';
export const TRACK_WBH = 'wbh-masterclass';

export const TRACKS = {
  [TRACK_INDIVIDUAL]: {
    id: TRACK_INDIVIDUAL,
    name: 'AI Productivity Training',
    shortName: 'AI Productivity Training',
    audience: 'Individuals & teams',
    priceKes: 13500,
    strikePriceKes: 30000,
    registerPath: '/ai-training/register',
    landingPath: '/ai-training',
    refPrefix: 'CWI',
    // Two 4-hour Saturday sessions per cohort.
    durationLabel: '2 Saturdays · 9:00am–1:00pm each',
    venue: '4th Floor, Delta Annex, Delta Corner, Waiyaki Way, Nairobi',
    supportsOnline: true,
    hasCohorts: true,
  },
  [TRACK_WBH]: {
    id: TRACK_WBH,
    name: 'AI Masterclass for Women Entrepreneurs',
    shortName: 'AI Masterclass',
    audience: 'Women Biz360 Hub members',
    partner: 'Women Biz360 Hub',
    priceKes: 7500,
    strikePriceKes: null,
    registerPath: '/women-biz360/register',
    landingPath: '/women-biz360',
    refPrefix: 'CWW',
    durationLabel: 'Full day · 8:30am–4:00pm',
    venue: 'Delta Centre, Waiyaki Way, Nairobi',
    supportsOnline: false,
    hasCohorts: false,
    // Single fixed event.
    eventDate: '2026-08-27',
    eventStart: '08:30',
    eventEnd: '16:00',
  },
};

export const TRACK_IDS = Object.keys(TRACKS);

export function getTrack(trackId) {
  return TRACKS[trackId] || null;
}

export function isValidTrack(trackId) {
  return Object.prototype.hasOwnProperty.call(TRACKS, trackId);
}

/** Amount payable, in KES, for a track. Single source of truth for pricing. */
export function priceFor(trackId) {
  const track = getTrack(trackId);
  if (!track) throw new Error(`Unknown track: ${trackId}`);
  return track.priceKes;
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
 * Long form reads like a person wrote it — "Thursday, 27 August 2026".
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
// Event summary — one shape both tracks render from
// ---------------------------------------------------------------------------

/**
 * Human-readable schedule for a registration, used in emails, the checkout
 * summary and the admin digest. Weekday names are always derived from the date
 * itself so a wrong day can never be printed.
 */
export function describeSchedule({ track, cohortId }) {
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
export function startDateFor({ track, cohortId }) {
  if (track === TRACK_WBH) return TRACKS[TRACK_WBH].eventDate;
  const cohort = getCohort(cohortId);
  return cohort ? cohort.dayOne : null;
}

/** The last day of a registration's training — drives the follow-up pack. */
export function endDateFor({ track, cohortId }) {
  if (track === TRACK_WBH) return TRACKS[TRACK_WBH].eventDate;
  const cohort = getCohort(cohortId);
  return cohort ? cohort.dayTwo : null;
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
 * A short, unambiguous reference the customer types as the M-Pesa account
 * number and that we key every record off. Format: CWI-7F3K2M.
 */
export function generateReference(trackId) {
  const prefix = getTrack(trackId)?.refPrefix || 'CW';
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
  return `${prefix}-${body}`;
}

export const REFERENCE_RE = /^CW[IW]-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;

export function isValidReference(ref) {
  return typeof ref === 'string' && REFERENCE_RE.test(ref);
}

export function formatKes(amount) {
  return `Ksh ${Number(amount).toLocaleString('en-KE')}`;
}

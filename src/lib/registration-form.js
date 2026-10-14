/**
 * The registration questions, and the rules for validating them.
 *
 * Shared by the form components and the API route so the browser and the server
 * agree on exactly one definition of "valid". Safe to import from client
 * components — no server-only dependencies.
 *
 * Three tracks can be registered for: Kickstart, Essentials and the Programme.
 * Each asks for less than the one above it, because a Ksh 500 buyer should not
 * fill in the questionnaire that shapes an eight-hour programme. The Women
 * Biz360 masterclass is retired, so a submission naming it is treated as the
 * Programme rather than honoured — there is no page that can produce one, and a
 * forged post must not be able to buy a seat at the old partner price.
 */

import { TRACK_ESSENTIALS, TRACK_KICKSTART, TRACK_PROGRAMME, tierFromParam } from '@/lib/training';

export const INDUSTRIES = [
  'Agriculture', 'Automotive', 'Banking & Finance', 'Beauty & Wellness',
  'Construction & Real Estate', 'Consulting & Advisory', 'Education & Training',
  'Energy', 'Events & Hospitality', 'Fashion & Retail', 'Food & Catering',
  'Healthcare', 'Insurance', 'Legal', 'Logistics & Transport', 'Manufacturing',
  'Marketing & Media', 'Non-profit & NGO', 'Technology & Software',
  'Tourism & Travel', 'Other',
];

export const AI_EXPERIENCE = [
  'Yes, regularly',
  'Yes, a few times',
  'I have tried once',
  'No, never',
];

export const AI_TOOLS = [
  'Claude', 'ChatGPT', 'Google Gemini', 'Microsoft Copilot', 'Perplexity',
  'Meta AI (WhatsApp)', 'Canva AI', 'NotebookLM', 'Other', 'None yet',
];

export const TIME_CONSUMING_TASKS = [
  'Social media & marketing',
  'Customer messages & follow-up',
  'Proposals, quotes & tenders',
  'Reports & documents',
  'Paperwork & admin',
  'Accounting & invoicing',
  'Research',
  'Planning & scheduling',
  'Everything — I do it all myself',
];

export const REFERRAL_SOURCES = [
  'Instagram', 'LinkedIn', 'TikTok', 'WhatsApp', 'Google search',
  'A friend or colleague', 'A previous Cloudwise training',
  'Other',
];

export const ATTENDANCE_OPTIONS = [
  { value: 'in-person', label: 'In person, Nairobi' },
  { value: 'online', label: 'Online via Google Meet' },
];

/** "Which best describes you?" — drives team follow-up the same day. */
export const BUYER_TYPES = [
  { value: 'owner', label: 'I run a business' },
  { value: 'employee', label: 'I work for an organisation' },
  { value: 'colleagues', label: 'I am registering colleagues' },
  { value: 'student', label: 'I am a student or job seeker' },
];
export const HEADCOUNT_MAX = 50;
/** Three or more people, or "registering colleagues", is a team lead. */
export const TEAM_LEAD_HEADCOUNT = 3;

/**
 * "Where does your time go?" → the assistant built on Day One (tiered plan
 * rev4, §5.2). Shown on the confirmation screen and in the welcome email.
 */
export const ASSISTANT_FOR_TASK = {
  'Social media & marketing': 'Content Manager',
  'Proposals, quotes & tenders': 'Quotation Builder, or Proposal and Tender Analyst',
  'Customer messages & follow-up': 'Customer Reply Agent, or Follow-Up Officer',
  'Paperwork & admin': 'Inbox Officer, or Meeting-to-Minutes Agent',
  'Reports & documents': 'Report Writer',
  Research: 'Research Assistant',
  'Accounting & invoicing': 'Numbers Reader',
};

export function assistantFor(tasks = []) {
  for (const task of tasks) if (ASSISTANT_FOR_TASK[task]) return ASSISTANT_FOR_TASK[task];
  return null;
}

/** Which questions each track asks. */
export function formShapeFor(track) {
  return {
    kickstart: track === TRACK_KICKSTART,
    profile: track !== TRACK_KICKSTART, // buyer type, headcount, time, experience
    fullQuestionnaire: track === TRACK_PROGRAMME,
    credit: track === TRACK_ESSENTIALS || track === TRACK_PROGRAMME,
  };
}

export const CREDIT_CODE_RE = /^[A-Z0-9-]{6,20}$/;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^(?:\+?254|0)?[17]\d{8}$/;

const TEXT_LIMITS = {
  firstName: 60,
  lastName: 60,
  email: 160,
  phone: 20,
  organization: 120,
  jobTitle: 120,
  city: 80,
  industry: 80,
  aiExperience: 80,
  biggestChallenge: 1000,
  goal: 1000,
  liveChallenge: 1000,
  dietary: 200,
  referralSource: 80,
};

const ARRAY_FIELDS = ['aiTools', 'timeConsumingTasks', 'topicPriorities'];

/**
 * Validate a submission and return `{ errors, value }`.
 *
 * `errors` is keyed by field name so the form can render each message beside
 * its input. `value` is the cleaned data, safe to persist.
 */
export function validateRegistration(input = {}) {
  const errors = {};
  const value = {};

  const track = tierFromParam(input.track);
  value.track = track;
  const shape = formShapeFor(track);

  const text = (field, { required = false, min = 0 } = {}) => {
    const raw = typeof input[field] === 'string' ? input[field].trim() : '';
    if (!raw) {
      if (required) errors[field] = 'This is required.';
      return '';
    }
    if (raw.length < min) {
      errors[field] = `Please write a little more.`;
      return raw;
    }
    const limit = TEXT_LIMITS[field] || 500;
    if (raw.length > limit) {
      errors[field] = `Please keep this under ${limit} characters.`;
    }
    return raw.slice(0, limit);
  };

  value.firstName = text('firstName', { required: true, min: 2 });
  value.lastName = text('lastName', { required: true, min: 2 });

  value.email = text('email', { required: true });
  if (value.email && !EMAIL_RE.test(value.email)) {
    errors.email = 'That email does not look right.';
  }

  value.phone = text('phone', { required: true });
  if (value.phone && !PHONE_RE.test(value.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Use a Kenyan mobile number, e.g. 0712 345 678.';
  }

  value.organization = text('organization');
  value.jobTitle = text('jobTitle');
  value.dietary = text('dietary');
  value.liveChallenge = text('liveChallenge');

  if (shape.kickstart) {
    // Kickstart runs on Google Meet only.
    value.attendance = 'online';
  } else {
    value.attendance = input.attendance === 'online' ? 'online' : 'in-person';
    if (!['online', 'in-person'].includes(input.attendance)) {
      errors.attendance = 'Choose how you would like to attend.';
    }
  }

  // For Kickstart this is the session id ("ks-2026-10-28"); for the others the
  // cohort id ("2026-11"). One field, so reminders work the same for all.
  value.cohortId = typeof input.cohortId === 'string' ? input.cohortId.trim() : '';
  if (!value.cohortId) {
    errors.cohortId = shape.kickstart ? 'Choose the Wednesday you want.' : 'Choose the dates you want to attend.';
  }

  value.city = text('city');
  value.industry = text('industry');
  value.aiExperience = text('aiExperience', { required: shape.profile });

  if (shape.profile) {
    value.buyerType = BUYER_TYPES.some((b) => b.value === input.buyerType) ? input.buyerType : '';
    if (!value.buyerType) errors.buyerType = 'Choose the one that describes you best.';

    const headcount = Number.parseInt(input.headcount, 10);
    value.headcount = Number.isFinite(headcount) ? headcount : 0;
    if (value.headcount < 1 || value.headcount > HEADCOUNT_MAX) {
      errors.headcount = `Enter a number from 1 to ${HEADCOUNT_MAX}.`;
    }
  }

  const code = typeof input.creditCode === 'string' ? input.creditCode.trim().toUpperCase().replace(/\s+/g, '') : '';
  value.creditCode = shape.credit && code ? code.slice(0, 20) : '';
  if (value.creditCode && !CREDIT_CODE_RE.test(value.creditCode)) {
    errors.creditCode = 'That does not look like a credit code or an M-Pesa code.';
  }
  value.biggestChallenge = text('biggestChallenge');
  value.goal = text('goal');
  value.referralSource = text('referralSource');

  for (const field of ARRAY_FIELDS) {
    const raw = Array.isArray(input[field]) ? input[field] : [];
    value[field] = raw
      .filter((v) => typeof v === 'string' && v.trim())
      .map((v) => v.trim().slice(0, 120))
      .slice(0, 20);
  }
  if (shape.profile && !value.timeConsumingTasks.length) {
    errors.timeConsumingTasks = 'Pick at least one. It decides the assistant you build.';
  }

  value.deviceReady = input.deviceReady !== false;
  value.whatsappOptIn = Boolean(input.whatsappOptIn);

  value.consent = Boolean(input.consent);
  if (!value.consent) {
    errors.consent = 'We need your consent to hold your details and contact you.';
  }

  return { errors, value, ok: Object.keys(errors).length === 0 };
}

export const CONSENT_TEXT =
  'I agree that Cloudwise may store the details I have given here and contact me about this training and related updates. I can ask to be removed at any time.';

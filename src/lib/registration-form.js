/**
 * The registration questions, and the rules for validating them.
 *
 * Shared by the form components and the API route so the browser and the server
 * agree on exactly one definition of "valid". Safe to import from client
 * components — no server-only dependencies.
 *
 * The individual track's questions mirror the Zoom pre-registration form that
 * ran for the free Women Biz360 webinar, since those answers proved genuinely
 * useful for tailoring content. The masterclass track skips them: those
 * attendees already answered at the free session, so it only asks what is new.
 */

import { TRACK_INDIVIDUAL, TRACK_WBH } from '@/lib/training';

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

/**
 * The masterclass modules. Taken from the demand the free webinar surfaced:
 * RFP responses, beating AI-detector-sounding writing, Canva, transcription,
 * NotebookLM, spreadsheets, and safe handling of confidential data.
 */
export const MASTERCLASS_TOPICS = [
  'Responding to RFPs & writing proposals on my letterhead',
  'Making AI writing sound like me, not like AI',
  'A month of social content, and posting it through Canva',
  'Analysing my numbers & spreadsheets safely',
  'Turning recordings & meetings into notes (transcription)',
  'Researching with my own documents (NotebookLM)',
  'Customer replies & follow-up that win the sale',
  'Handling confidential client data safely',
];

export const REFERRAL_SOURCES = [
  'Instagram', 'LinkedIn', 'TikTok', 'WhatsApp', 'Google search',
  'A friend or colleague', 'Women Biz360 Hub', 'A previous Cloudwise training',
  'Other',
];

export const ATTENDANCE_OPTIONS = [
  { value: 'in-person', label: 'In person, Nairobi' },
  { value: 'online', label: 'Online via Zoom' },
];

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

  const track = input.track === TRACK_WBH ? TRACK_WBH : TRACK_INDIVIDUAL;
  value.track = track;

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

  // Attendance: the masterclass is in person only.
  if (track === TRACK_WBH) {
    value.attendance = 'in-person';
  } else {
    value.attendance = input.attendance === 'online' ? 'online' : 'in-person';
    if (!['online', 'in-person'].includes(input.attendance)) {
      errors.attendance = 'Choose how you would like to attend.';
    }
  }

  if (track === TRACK_INDIVIDUAL) {
    value.cohortId = typeof input.cohortId === 'string' ? input.cohortId.trim() : '';
    if (!value.cohortId) errors.cohortId = 'Choose the dates you want to attend.';

    value.city = text('city');
    value.industry = text('industry');
    value.aiExperience = text('aiExperience', { required: true });
    value.biggestChallenge = text('biggestChallenge');
    value.goal = text('goal');
    value.referralSource = text('referralSource');
  } else {
    value.cohortId = null;
  }

  for (const field of ARRAY_FIELDS) {
    const raw = Array.isArray(input[field]) ? input[field] : [];
    value[field] = raw
      .filter((v) => typeof v === 'string' && v.trim())
      .map((v) => v.trim().slice(0, 120))
      .slice(0, 20);
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

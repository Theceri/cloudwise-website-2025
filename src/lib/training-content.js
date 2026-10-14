/**
 * The words on the training pages, written once.
 *
 * Source: tiered plan CW-2026-AIT-01 revision 4 (§4, §5, §6, §7), with the
 * decisions of 14 and 15 October 2026: Essentials at Ksh 5,500, every class
 * paid in full, no recordings, Google Meet, 72 prompts, and only the tools the
 * course actually teaches.
 *
 * Prices are not typed here. They come from `TRACKS` in src/lib/training.js, so
 * a price change is one edit.
 */

import {
  PRIVATE_PRICE_KES,
  TEAM_MIN_PEOPLE,
  TEAM_PRICE_PER_PERSON_KES,
  TRACKS,
  TRACK_ESSENTIALS,
  TRACK_KICKSTART,
  TRACK_PROGRAMME,
  formatKes,
} from '@/lib/training';

const k = TRACKS[TRACK_KICKSTART];
const e = TRACKS[TRACK_ESSENTIALS];
const p = TRACKS[TRACK_PROGRAMME];

export const TIER_DETAILS = {
  [TRACK_KICKSTART]: {
    when: 'Wednesdays, 7:00pm to 9:00pm EAT',
    format: 'Live on Google Meet',
    pitch:
      'Set up Claude, learn the one prompt method that works, and finish three real tasks before the session ends: a week of social posts, a reply to a difficult customer and the summary of a long document.',
    leaveWith: ['Claude set up on your phone or laptop', 'The R.C.T.F. prompt method', 'Three real tasks done'],
    includes: [
      'The live 2-hour session',
      'The Starter Prompt Pack (10 prompts)',
      'Every class prompt in writing afterwards',
      `A ${formatKes(k.credit.amountKes)} credit toward your next course`,
    ],
    support: 'Questions answered in the session, then the WhatsApp broadcast list',
    credit: `${formatKes(k.credit.amountKes)} off Essentials or the Programme for ${k.credit.days} days`,
    cta: `Book for ${formatKes(k.priceKes)}`,
  },
  [TRACK_ESSENTIALS]: {
    when: 'One Saturday, 9:00am to 1:00pm',
    format: 'Delta Annex, Westlands, or Google Meet',
    pitch:
      'Leave with your own AI assistant, built for the job that eats your week, and tested on your real work. Bring a proposal, report or tender and leave with it drafted.',
    leaveWith: ['Your own AI assistant, built as a Claude Project', 'One real document drafted', 'A research note with sources'],
    includes: [
      'Participant Workbook and Agent Build Sheet',
      'The Prompt Pack (72 prompts)',
      'Quick Start, Cheatsheets and Safe and Legal AI Use',
      'Practice files and the class-prompts recap',
      'WhatsApp support community, with no end date',
      'Certificate of attendance',
    ],
    support: 'WhatsApp community, with no end date',
    credit: `${formatKes(e.credit.amountKes)} off the Programme for ${e.credit.days} days, so Day Two costs ${formatKes(
      p.priceKes - e.credit.amountKes
    )}`,
    cta: `Reserve a Saturday seat · ${formatKes(e.priceKes)}`,
  },
  [TRACK_PROGRAMME]: {
    when: 'Two Saturdays, 9:00am to 1:00pm',
    format: 'Delta Annex, Westlands, or Google Meet',
    pitch:
      'Everything in Essentials, plus a second Saturday. Watch AI read a live CRM, live invoices and a calendar, draft the follow-ups and stop for your approval. Then connect and upgrade your own assistant, and leave with a 30-day plan.',
    leaveWith: ['Your assistant upgraded and tested on live work', 'One workflow written down', 'Your 30-day plan'],
    includes: [
      'Everything in Essentials',
      'Workflow Recipe Cards and the Connectors and Workflows guide',
      'The AI Toolkit and Resource Pack',
      'Your 30-Day Plan',
      'WhatsApp support community, with no end date',
      'Certificate of completion',
    ],
    support: 'WhatsApp community, with no end date',
    credit: null,
    cta: `Join the Programme · ${formatKes(p.priceKes)}`,
  },
};

/** Rows of the comparison table: [label, kickstart, essentials, programme]. */
export const COMPARISON_ROWS = [
  ['Price', formatKes(k.priceKes), formatKes(e.priceKes), formatKes(p.priceKes)],
  ['Length', k.lengthLabel, e.lengthLabel, p.lengthLabel],
  ['When', TIER_DETAILS[TRACK_KICKSTART].when, TIER_DETAILS[TRACK_ESSENTIALS].when, TIER_DETAILS[TRACK_PROGRAMME].when],
  ['Where', 'Google Meet, up to 100', 'Delta Annex or Google Meet', 'Delta Annex or Google Meet'],
  ['You build your own AI assistant', '—', 'Yes', 'Yes, then upgrade and connect it'],
  ['Live connected workflow (CRM, invoices, calendar)', '—', '—', 'Yes'],
  ['Prompts', 'Starter pack (10)', 'Prompt Pack (72)', 'Prompt Pack (72)'],
  ['Support', 'Broadcast list', 'WhatsApp community, no end date', 'WhatsApp community, no end date'],
  ['Certificate', '—', 'Attendance', 'Completion'],
  ['Counts toward the next course', `${formatKes(k.credit.amountKes)} for ${k.credit.days} days`, `${formatKes(e.credit.amountKes)} for ${e.credit.days} days`, '—'],
];

/** Kickstart running order (rev4 §5.1). */
export const KICKSTART_RUNNING_ORDER = [
  ['0:00', 'Welcome, and what AI does well and badly. A poll: what eats most of your time?'],
  ['0:10', 'The toolbox: Claude, ChatGPT, Gemini, Copilot and Meta AI in WhatsApp, and which free account to open.'],
  ['0:20', 'R.C.T.F.: Role, Context, Task, Format. You rewrite a weak prompt of your own.'],
  ['0:40', 'Three live wins on your own business: a week of social posts, a reply that says no but keeps the customer, a one-page summary.'],
  ['1:20', 'Your task: post one in the chat, and the trainer solves two live.'],
  ['1:35', 'Safe use: what never to paste, and the Kenya Data Protection Act, 2019 in one minute.'],
  ['1:47', 'What comes next, and your credit code.'],
];

/** Day One — the Essentials Saturday (rev4 §5.2). */
export const DAY_ONE = [
  ['9:00', 'The honest picture', 'What AI does well and badly. Everyone names three tasks they brought.'],
  ['9:20', 'How it works, and how it fails', 'A deliberate wrong answer, the four checks, and how tokens and memory work on a free account.'],
  ['9:50', 'Prompting that works first time', 'R.C.T.F. and the five power moves, on your own weak prompts. Voice input.'],
  ['10:55', 'Writing that wins work', 'The difficult email, reports, a quotation from a price list, a tender turned into a compliance matrix.'],
  ['11:40', 'Research you can defend', 'Web search with citations, NotebookLM on your own documents, spotting an invented source.'],
  ['12:10', 'Build your AI assistant, version 1', 'The Agent Build Sheet for your own bottleneck, built live as a Claude Project and tested.'],
  ['12:45', 'Safe use, privacy and the law', 'Strip the identity, keep the shape. The Kenya Data Protection Act, 2019.'],
];

/** Day Two — the second Saturday (rev4 §5.3). */
export const DAY_TWO = [
  ['9:00', 'Report-back', 'What your assistant got wrong during the week. Two fixed live.'],
  ['9:20', 'Numbers without dread', 'A messy export into usable shape, formulas in plain English, a receipt photo into a spreadsheet.'],
  ['10:00', 'Marketing and content', 'A month of posts from one brief. Claude Design and HeyGen shown on the trainer’s screen.'],
  ['11:00', 'What a workflow is', 'The written recipe, connected with you approving, scheduled and repeating.'],
  ['11:20', 'Connected workflows, live', 'One instruction, four connectors: overdue invoices, stalled deals, free slots, drafted follow-ups for your approval.'],
  ['12:05', 'Assistant, version 2', 'Knowledge files, a fixed output format, and rules that stop last week’s mistakes.'],
  ['12:35', 'Repeating work', 'Saved prompts, Project instructions and scheduled work, and what must never run unattended.'],
  ['12:50', 'Your 30-day plan', 'What to pay for and when, and the community.'],
];

/** "Where does your time go?" → the assistant built on Day One (rev4 §5.2). */
export const TEN_ASSISTANTS = [
  ['Social media and marketing', 'Content Manager'],
  ['Proposals, quotes and tenders', 'Quotation Builder, or Proposal and Tender Analyst'],
  ['Customer messages and follow-up', 'Customer Reply Agent, or Follow-Up Officer'],
  ['Paperwork and admin', 'Inbox Officer, or Meeting-to-Minutes Agent'],
  ['Reports and documents', 'Report Writer'],
  ['Research', 'Research Assistant'],
  ['Accounting and invoicing', 'Numbers Reader'],
];

/** Only tools the course teaches. Decided 14 October 2026. */
export const TOOLS = [
  { name: 'Claude', desc: 'Your own AI assistant, built as a Claude Project and kept after the class' },
  { name: 'Claude connectors', desc: 'Day Two: AI reading a live CRM, invoices and a calendar, then stopping for your approval' },
  { name: 'NotebookLM', desc: 'Research that answers only from your own documents' },
  { name: 'ChatGPT, Gemini & Copilot', desc: 'The same task run on each, so you see the real differences' },
  { name: 'Voice & camera', desc: 'Dictate on your phone, and turn a photo of a receipt into a spreadsheet' },
  { name: 'Claude Design & HeyGen', desc: 'Day Two demonstration: from brief to flyer, and to a 30-second presenter video' },
];

export const POLICIES = [
  ['Payment', 'Every class is paid in full when you book.'],
  ['Recordings', 'Sessions are not recorded. You receive every prompt we type in class, in writing, the same week.'],
  ['Certificates', 'A certificate of completion for both Programme Saturdays, and a certificate of attendance for Essentials.'],
  ['Missed date', 'You can move your seat once to a later date: Kickstart any time before the session, Essentials with 3 days’ notice, the Programme with 5 days’ notice.'],
  ['Refunds', 'We do not give refunds. Moving your seat is the option instead.'],
  ['Joining online', 'The Google Meet link arrives the day before.'],
];

/** The combined FAQ for the hub (rev4 §7), each answer short enough to quote. */
export function hubFaq({ nextKickstart, nextEssentials } = {}) {
  return [
    {
      q: 'Which option should I pick?',
      a: 'New to AI, or not sure it is for you: Kickstart. You use ChatGPT a little and want it to do real work: Essentials. You want AI connected to your tools and built into your week: the Programme.',
    },
    {
      q: 'What is "your own AI assistant"?',
      a: 'An assistant set up once, for one recurring job, so it already knows who you are, what the job is, what it must never get wrong and what the finished work looks like. You build it in Claude during the session and keep it.',
    },
    {
      q: `Does the ${formatKes(k.priceKes)} count toward a bigger course?`,
      a: `Yes, within ${k.credit.days} days. The code arrives on WhatsApp and email after the session. Essentials counts in full toward the Programme for ${e.credit.days} days, so Day Two then costs ${formatKes(p.priceKes - e.credit.amountKes)}.`,
    },
    {
      q: 'When is the next session?',
      a: [
        nextKickstart ? `The next Kickstart is ${nextKickstart}, 7:00pm to 9:00pm.` : null,
        nextEssentials ? `The next Essentials Saturday, which is also Day One of the Programme, is ${nextEssentials}.` : null,
      ]
        .filter(Boolean)
        .join(' ') || 'Dates for every option are listed on the registration page.',
    },
    { q: 'How do I pay?', a: 'By M-Pesa when you book: we send a prompt to your phone. Every class is paid in full at booking.' },
    { q: 'Is this a ChatGPT course?', a: 'It is taught on Claude, on free accounts. ChatGPT, Gemini and Copilot are run against the same task so you see the real differences.' },
    { q: 'Are the sessions recorded?', a: 'No. You receive every prompt we type in class, in writing, the same week. The WhatsApp community answers the questions that come up later.' },
    { q: 'Do I get a certificate?', a: 'Yes. A certificate of completion for both Programme Saturdays, and a certificate of attendance for Essentials.' },
    {
      q: 'What if I miss my date?',
      a: 'You can move your seat once to a later date: Kickstart any time before the session, Essentials with 3 days’ notice, the Programme with 5 days’ notice. We do not give refunds.',
    },
    { q: 'Do I need a tech background?', a: 'No. If you can use a browser and send an email, you can do this. Every session is hands-on with your own work.' },
    {
      q: 'Can you train my whole team?',
      a: `Yes. Team training is ${formatKes(TEAM_PRICE_PER_PERSON_KES)} per person for ${TEAM_MIN_PEOPLE} people or more, built around your own reports, tenders and systems. Private one-to-one training is ${formatKes(PRIVATE_PRICE_KES)}. We have trained teams at Bamburi Cement, FEKAN Howell LLP, TechCamp and Stratostaff.`,
    },
  ];
}

/** Team and private formats (rev4 §6). */
export const TEAM_FORMATS = [
  ['Free demonstration', '30 to 60 minutes', 'Free', 'For a large group. It opens the conversation about a team booking.'],
  ['Team programme', '8 hours', `${formatKes(TEAM_PRICE_PER_PERSON_KES)} per person, ${TEAM_MIN_PEOPLE} people or more`, 'One day or two half-days, in person or online, built on your own documents and systems.'],
  ['Executive briefing', '2 to 3 hours', 'Quoted', 'For leadership teams.'],
  ['Microsoft 365 and Copilot version', '8 hours', 'Quoted', 'For teams on Copilot.'],
];

export const TEAM_INCLUDES = [
  'A discovery call',
  'A syllabus you approve before the day',
  'The training day itself',
  'The WhatsApp support group',
  'A follow-up clinic three to four weeks later',
  'An AI use policy template',
];

export const TRAINED_ORGANISATIONS = ['Bamburi Cement', 'FEKAN Howell LLP', 'TechCamp', 'Stratostaff'];

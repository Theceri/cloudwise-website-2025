/**
 * Onboarding resources sent after payment.
 *
 * Written once here and rendered in two places — the welcome email and the
 * public resource pages — so the two can never drift apart.
 *
 * The content is distilled from the Cloudwise AI Productivity Training pack and
 * the Women Biz360 Hub webinar materials: the four-part prompt framework, the
 * prompt library, and the pre-work that makes day one hands-on from minute one.
 */

import { TRACK_WBH } from '@/lib/training';

export const RESOURCE_INDEX = [
  {
    slug: 'ai-readiness',
    title: 'AI Readiness Guide',
    tag: 'Do this before day one',
    summary:
      'The four accounts to open, what to bring, and a 15-minute warm-up so you arrive ready to build.',
  },
  {
    slug: 'prompt-pack',
    title: 'Starter Prompt Pack',
    tag: 'Yours to keep',
    summary:
      'The four-part prompt framework plus ten copy-and-paste prompts that do real work in your business today.',
  },
  {
    slug: 'session-prep',
    title: 'Your Session Checklist',
    tag: 'The day itself',
    summary:
      'Timings, what to bring, how to prepare the one real task we will solve live, and how to reach us.',
  },
];

export function getResource(slug) {
  return RESOURCE_INDEX.find((r) => r.slug === slug) || null;
}

// ---------------------------------------------------------------------------
// The prompt framework — the spine of everything we teach
// ---------------------------------------------------------------------------

export const PROMPT_FRAMEWORK = {
  title: 'The four-part recipe',
  intro:
    'Think of AI as a brilliant new assistant on her first day. She is clever, but she only knows what you tell her. So tell her four things:',
  parts: [
    { label: 'Who it is', example: '“You are my social media assistant.”' },
    { label: 'Who you are', example: '“I run a small catering business in Nakuru; my customers are…”' },
    { label: 'What you want', example: '“Write a week of posts.”' },
    { label: 'How you want it', example: '“Warm, simple English with a little Kiswahili, for WhatsApp.”' },
  ],
  rule: 'Then never accept the first draft. Say “make it shorter”, “make it warmer”, “add an offer”, “give me 3 more options”.',
  safety:
    'Never paste private details — ID numbers, full account numbers, real client financials. Write “a customer” instead of a real name, and always read what the AI writes before you send it. You are the boss; you approve everything.',
};

// ---------------------------------------------------------------------------
// Pre-work
// ---------------------------------------------------------------------------

export const READINESS_ACCOUNTS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    why: 'Our main tool. The strongest for real business writing, analysis and finished documents.',
    required: true,
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    why: 'The all-round daily driver, and the one most people have already heard of.',
    required: true,
  },
  {
    name: 'Google Gemini',
    url: 'https://gemini.google.com',
    why: 'Best for reading your files and documents, and for anything already in Google.',
    required: false,
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    why: 'Research with live information and sources you can check.',
    required: false,
  },
];

export const READINESS_STEPS = [
  {
    title: 'Open your accounts before the day',
    detail:
      'Sign up for the free tiers above using an email you can access on the day. Signing up in the room costs everyone twenty minutes — and verification emails do not always arrive on venue wifi.',
  },
  {
    title: 'Bring a laptop and its charger',
    detail:
      'This is 100% hands-on. A phone is fine as a backup but you cannot build a document, a spreadsheet or a workflow on one. Bring the laptop you actually work on.',
  },
  {
    title: 'Write down the three tasks that eat your week',
    detail:
      'The things you do over and over: quotations, social posts, customer replies, reports, chasing payments. We turn your real list into AI shortcuts on the day — not made-up examples.',
  },
  {
    title: 'Bring one real piece of your business',
    detail:
      'Your letterhead, your business profile, a recent proposal, a price list — whatever you would normally have to write from scratch. Attaching your own documents is what turns a generic answer into something you can actually send.',
  },
  {
    title: 'Do the 15-minute warm-up',
    detail:
      'Open Claude and run the two warm-up prompts below. You will arrive already knowing what the tool feels like, and we can start at the good part.',
  },
];

export const WARM_UP_PROMPTS = [
  {
    title: 'Warm-up 1 — meet your assistant',
    prompt: `Act as a practical business advisor for small businesses in Kenya. I run [describe your business in one line]. My biggest challenge right now is [describe the problem plainly].

Give me 5 realistic, low-cost ideas to solve this, suited to my kind of business and a small budget. For each idea, tell me the very first step I should take this week.`,
    note: 'Then reply “now pick the best one and give me a simple 2-week plan”. Feel how the back-and-forth is where the value is.',
  },
  {
    title: 'Warm-up 2 — turn a rough note into something you can send',
    prompt: `Turn this rough note into a warm, clear, professional message I can send to a customer on WhatsApp:
"[paste something you actually typed in a hurry this week]"

Keep it short and friendly, confirm the key details clearly, and end politely.`,
    note: 'This is the single fastest win most people get. Save the result as a template.',
  },
];

// ---------------------------------------------------------------------------
// The prompt library
// ---------------------------------------------------------------------------

export const PROMPT_LIBRARY = [
  {
    n: 1,
    title: 'A whole week of content in five minutes',
    useWhen: 'You keep going quiet on social media for weeks, and you want posts that actually bring customers.',
    prompt: `You are my social media assistant. I run [describe your business]. My customers are [who they are], and my #1 goal right now is getting NEW customers.

Give me a week of social media content (Monday to Sunday) designed to attract and convert new customers. For each day give me:
- A short, warm caption in simple English with a touch of natural Kiswahili where it fits
- 3 relevant hashtags
- One idea for the photo or video to post
- A clear, low-pressure call to action

Keep the tone friendly and real, not salesy. Mix value, social proof, behind-the-scenes, customer love, and one gentle offer during the week.`,
    levelUp: [
      'Redo Tuesday and Friday to promote a weekend offer: [your offer].',
      'Give me 5 caption options for a single photo of [describe the photo].',
      'Now write a one-week plan for WhatsApp status only — shorter and more personal.',
    ],
  },
  {
    n: 2,
    title: 'Rescue a sale when someone says “you’re too expensive”',
    useWhen: 'A customer pushes back on price and you freeze, get defensive, or drop your price just to keep them.',
    prompt: `A customer sent me this message about my [type of business]:
"[paste exactly what the customer said]"

Help me reply. I want to sound warm and confident, NOT defensive. Gently explain the value I offer ([list 2–4 real reasons]) and invite them to go ahead or come see for themselves. Keep it short enough for WhatsApp, friendly, with a little Kiswahili warmth.`,
    levelUp: [
      'Give me 3 versions: one warm, one professional, one very short.',
      'Now write a reply for when I can offer a small discount for paying in advance.',
    ],
  },
  {
    n: 3,
    title: 'Follow up someone who went quiet',
    useWhen: 'Someone asked for a quote, you replied… and then silence. Most sales are lost simply because nobody followed up.',
    prompt: `Write a friendly, no-pressure follow-up message to a customer who asked about my [product/service] about [number] days ago and then went quiet. I don't want to sound desperate or pushy. Give them an easy, warm reason to reply and gently remind them what I offer. Short, for WhatsApp, with a soft call to action.`,
    levelUp: [
      'Add a small reason to act now, like limited slots this weekend.',
      'Write a second follow-up for a week later if they still have not replied.',
    ],
  },
  {
    n: 4,
    title: 'Your on-demand business advisor',
    useWhen: 'You are stuck on a real problem and wish you had a mentor to think it through with.',
    prompt: `Act as a practical business advisor for small businesses in Kenya. I run [describe your business]. My challenge is: [describe the problem clearly].

Give me 5 realistic, low-cost ideas to solve this, suited to my kind of business and a small budget. For each idea, tell me the very first step I should take this week.`,
    levelUp: [
      'Now pick the best idea and give me a simple 2-week plan to try it.',
      'What are the risks of each idea, and how do I avoid them?',
    ],
  },
  {
    n: 5,
    title: 'Respond to an RFP or write a proposal on your letterhead',
    useWhen: 'A tender or request for proposal lands and you lose a whole evening formatting a document.',
    prompt: `I am responding to the attached request for proposal. I have also attached my company profile and letterhead.

Write a complete, professional response using MY company details from the profile — team, track record, registration details — so nothing is invented. Cover: understanding of the requirement, our approach, deliverables, timeline, team, and why us. Use [PLACEHOLDER] for any figure I need to fill in.

Format it as a clean, finished document on my letterhead, ready to send — not a rough draft.`,
    levelUp: [
      'Now write the one-page executive summary version.',
      'Make the approach section more specific to [the client’s sector].',
    ],
    note: 'Attach your own business profile and letterhead so the names match and the AI fills in your firm’s details automatically. This is the module people ask for most.',
  },
  {
    n: 6,
    title: 'Turn a rough, rushed note into a polished message',
    useWhen: 'You type in a hurry and want it to go out looking professional.',
    prompt: `Turn this rough note into a warm, clear, professional message I can send to a customer on WhatsApp:
"[paste your rough note exactly as you typed it]"

Keep it short and friendly, confirm the key details clearly, and end politely.`,
    levelUp: [
      'Now make a reusable template with blanks I can fill in each time.',
      'Add a polite line about payment via M-Pesa paybill [number].',
    ],
    note: 'You can dictate the rough note with voice input instead of typing it — ideal at the end of a long day.',
  },
  {
    n: 7,
    title: 'A marketing plan for the budget you actually have',
    useWhen: 'You know you should market more but do not know where limited money goes furthest.',
    prompt: `I run [describe your business] and my customers are [who they are]. I have KES [amount] to spend on marketing this month.

Give me a simple, practical plan for how to spend it to get the most new customers. Focus on low-cost and free options — social media, WhatsApp, referrals, local partnerships. Lay it out week by week with what to do and roughly what it costs.`,
    levelUp: [
      'What can I do this month for free, with no budget at all?',
      'Which one thing should I do first for the fastest result?',
    ],
  },
  {
    n: 8,
    title: 'Make sense of your numbers',
    useWhen: 'You have a messy spreadsheet or a pile of figures and no time to analyse them.',
    prompt: `Here are my sales figures for the last [period]. Remove any customer names before you analyse — I have replaced them with codes.

Tell me: what is going up, what is going down, which products or services actually make me money, and the three things you would change first. Explain it in plain language, not accounting jargon, and show me the numbers behind each conclusion.`,
    levelUp: [
      'Now turn this into a one-page summary I could show a bank or an investor.',
      'What questions should I be asking that I have not asked?',
    ],
    note: 'Strip real names, ID numbers and account numbers first. Codes and totals are enough for the analysis.',
  },
  {
    n: 9,
    title: 'Handle a complaint and keep the customer',
    useWhen: 'A customer is upset and your reply decides whether you lose them or win them for good.',
    prompt: `A customer is upset because [describe what went wrong]. Help me reply. I want to:
- Apologise sincerely without making excuses
- Show I take it seriously
- Offer a fair way to make it right ([your idea])
- Keep them as a happy customer

Keep it warm, professional and short enough for WhatsApp.`,
    levelUp: [
      'Give me a calmer version for when the customer is very angry.',
      'Help me write a simple policy so this does not happen again.',
    ],
  },
  {
    n: 10,
    title: 'Plan your week so nothing important slips',
    useWhen: 'You are doing everything, and things fall through the cracks because it is all in your head.',
    prompt: `I run [describe your business]. Here are my goals and tasks for this week:
[list everything on your mind — orders, deliveries, marketing, errands, family, everything]

Help me turn this into a simple, realistic daily to-do list (Monday to Saturday). Group similar tasks together, put the most important things first, and keep each day manageable. Add a short note on what NOT to worry about until next week.`,
    levelUp: [
      'Which of these tasks could I delegate or drop entirely?',
      'Turn my top 3 goals for this month into weekly steps.',
    ],
    note: 'Five minutes every Sunday evening is one of the simplest habits that separates a stressed business from a calm, growing one.',
  },
];

// ---------------------------------------------------------------------------
// Track-specific framing
// ---------------------------------------------------------------------------

export function resourceIntro(track) {
  if (track === TRACK_WBH) {
    return {
      greeting: 'Karibu — your seat is confirmed',
      body: 'You have already seen what AI can do. Now you are coming to build it into your own business, with us beside you. This pack is what to do between now and then.',
      signoff: 'Learn. Connect. Grow. Succeed.',
      partner: 'Women Biz360 Hub × Cloudwise',
    };
  }
  return {
    greeting: 'Welcome — your seat is confirmed',
    body: 'Two Saturdays from now you will have AI doing the work that currently eats your week. This pack is how you arrive ready to build rather than ready to watch.',
    signoff: 'See you in the room.',
    partner: 'Cloudwise AI Productivity Training',
  };
}

/** What to bring, phrased for the format they chose. */
export function whatToBring({ track, attendance }) {
  const base = [
    'Your laptop and its charger',
    'Your phone',
    'One real task from your business we will solve live',
    'Your business profile or letterhead, if you have one',
  ];

  if (attendance === 'online') {
    return [
      ...base,
      'A quiet spot and a steady internet connection',
      'Headphones — they make the hands-on parts much easier to follow',
    ];
  }

  return [
    ...base,
    track === TRACK_WBH
      ? 'Arrive by 8:15am so we can start on time'
      : 'Arrive by 8:45am so we can start on time',
  ];
}

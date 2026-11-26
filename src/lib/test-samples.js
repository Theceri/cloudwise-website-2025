import {
  TRACK_ESSENTIALS,
  TRACK_INDIVIDUAL,
  TRACK_KICKSTART,
  TRACK_WBH,
  TRACKS,
  describeSchedule,
  listKickstartSessions,
  listOpenCohorts,
  startDateFor,
} from '@/lib/training';

/**
 * Sample bookings for the test routes (/api/test/emails and /api/test/whatsapp).
 *
 * They mirror a real registration closely enough that a formatting problem
 * shows up in a test rather than in a customer's inbox or an admin's chat.
 */

export function sampleRegistration(track = TRACK_INDIVIDUAL) {
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

/**
 * Several trainings with several people each, listed out of order on purpose,
 * so a test admin email shows the real sort: the latest training at the top and
 * the newest registration first within each training.
 */
export function sampleRoster(individual, masterclass) {
  const laterCohort = listOpenCohorts({ count: 2 })[1];
  const session = listKickstartSessions({ count: 1 })[0];
  const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

  const rows = [
    masterclass,
    { ...individual, reference: 'A9K2M4', status: 'pending', firstName: 'Grace', lastName: 'Achieng', createdAt: hoursAgo(50) },
    individual,
    { ...individual, reference: 'A7QW3E', firstName: 'Brian', lastName: 'Otieno', createdAt: hoursAgo(5) },
  ];

  if (session) {
    rows.push({
      ...individual,
      reference: 'KM3R8D',
      track: TRACK_KICKSTART,
      cohortId: session.id,
      cohortLabel: session.label,
      startDate: session.date,
      amount: TRACKS[TRACK_KICKSTART].priceKes,
      firstName: 'Kevin',
      lastName: 'Mutua',
      createdAt: hoursAgo(2),
    });
  }

  if (laterCohort) {
    rows.push({
      ...individual,
      reference: 'EX4T7P',
      track: TRACK_ESSENTIALS,
      cohortId: laterCohort.id,
      cohortLabel: describeSchedule({ track: TRACK_ESSENTIALS, cohortId: laterCohort.id }).headline,
      startDate: laterCohort.dayOne,
      amount: TRACKS[TRACK_ESSENTIALS].priceKes,
      firstName: 'Wanjiku',
      lastName: 'Kamau',
      createdAt: hoursAgo(30),
    });
  }

  return rows;
}

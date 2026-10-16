import 'server-only';

import { TRACKS, formatKes, reportedValue } from '@/lib/training';

/**
 * HubSpot: every booking becomes a deal in the training pipeline, so nobody
 * has to copy WhatsApp leads into the CRM by hand, and the 48-hour follow-up
 * rule (tiered plan rev5, §2) has a list to work from.
 *
 * Needs a HubSpot private app token with the CRM contacts and deals scopes,
 * and the pipeline and stage ids from HubSpot (Settings → Objects → Deals →
 * Pipelines). Each id is read from the environment:
 *
 *   HUBSPOT_PRIVATE_APP_TOKEN
 *   HUBSPOT_TRAINING_PIPELINE_ID      the "AI training ladder" pipeline
 *   HUBSPOT_STAGE_BOOKED              a booking was made, not paid
 *   HUBSPOT_STAGE_KICKSTART_PAID
 *   HUBSPOT_STAGE_ESSENTIALS_PAID
 *   HUBSPOT_STAGE_PROGRAMME_PAID
 *   HUBSPOT_TEAM_PIPELINE_ID          the "Team training" pipeline
 *   HUBSPOT_TEAM_STAGE_NEW            its first stage
 *
 * Without the token nothing is sent. Every call fails soft: a booking or a
 * payment must never fail because the CRM had a bad minute.
 */

const API = 'https://api.hubapi.com';
const TIMEOUT_MS = 5000;

const env = (name) => process.env[name] || '';

export function isHubspotConfigured() {
  return Boolean(env('HUBSPOT_PRIVATE_APP_TOKEN') && env('HUBSPOT_TRAINING_PIPELINE_ID') && env('HUBSPOT_STAGE_BOOKED'));
}

const PAID_STAGE = {
  kickstart: 'HUBSPOT_STAGE_KICKSTART_PAID',
  essentials: 'HUBSPOT_STAGE_ESSENTIALS_PAID',
  individual: 'HUBSPOT_STAGE_PROGRAMME_PAID',
};

async function hubspot(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env('HUBSPOT_PRIVATE_APP_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HubSpot ${res.status}`);
  return data;
}

/** Create or update the contact by email. Returns the contact id. */
async function upsertContact({ email, firstName, lastName, phone, company, jobTitle }) {
  const data = await hubspot('/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    body: {
      inputs: [
        {
          idProperty: 'email',
          id: String(email).toLowerCase(),
          properties: {
            email: String(email).toLowerCase(),
            ...(firstName ? { firstname: firstName } : {}),
            ...(lastName ? { lastname: lastName } : {}),
            ...(phone ? { phone } : {}),
            ...(company ? { company } : {}),
            ...(jobTitle ? { jobtitle: jobTitle } : {}),
          },
        },
      ],
    },
  });
  return data?.results?.[0]?.id || null;
}

/** HubSpot's default association: deal to contact. */
const DEAL_TO_CONTACT = [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }];

async function createDeal({ name, amount, pipeline, stage, description, contactId }) {
  const data = await hubspot('/crm/v3/objects/deals', {
    method: 'POST',
    body: {
      properties: {
        dealname: name,
        amount: String(amount ?? ''),
        pipeline,
        dealstage: stage,
        description,
      },
      ...(contactId ? { associations: [{ to: { id: contactId }, types: DEAL_TO_CONTACT }] } : {}),
    },
  });
  return data?.id || null;
}

/**
 * The deal's description carries what HubSpot has no standard field for, so no
 * custom properties have to be created first.
 */
function describeBooking(registration) {
  const track = TRACKS[registration.track];
  return [
    `${track?.name || registration.track}, ${registration.cohortLabel || ''}`.trim(),
    `Reference ${registration.reference}`,
    `Attendance: ${registration.attendance === 'online' ? 'online' : 'in person'}`,
    registration.creditApplied ? `Credit ${registration.creditApplied.code} (${formatKes(registration.creditApplied.amountKes)})` : null,
    registration.headcount ? `People: ${registration.headcount}` : null,
    registration.teamLead ? 'TEAM LEAD: follow up today' : null,
    registration.utm?.utm_campaign ? `Ad campaign: ${registration.utm.utm_campaign}` : null,
    registration.utm?.utm_content ? `Ad: ${registration.utm.utm_content}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * A booking was made. Creates the contact and a deal in the "booked" stage.
 * Returns { dealId } for the caller to store on the registration.
 */
export async function onBookingCreated(registration) {
  if (!isHubspotConfigured()) return { sent: false, reason: 'not configured' };
  try {
    const contactId = await upsertContact({
      email: registration.email,
      firstName: registration.firstName,
      lastName: registration.lastName,
      phone: registration.phone,
      company: registration.organization,
      jobTitle: registration.jobTitle,
    });
    const track = TRACKS[registration.track];
    const dealId = await createDeal({
      name: `${track?.shortName || 'Training'}: ${[registration.firstName, registration.lastName].filter(Boolean).join(' ')} (${registration.reference})`,
      amount: reportedValue(registration),
      pipeline: env('HUBSPOT_TRAINING_PIPELINE_ID'),
      stage: env('HUBSPOT_STAGE_BOOKED'),
      description: describeBooking(registration),
      contactId,
    });

    // A team lead also opens a deal in the team pipeline, for the same-day call.
    if (registration.teamLead && env('HUBSPOT_TEAM_PIPELINE_ID') && env('HUBSPOT_TEAM_STAGE_NEW')) {
      await createDeal({
        name: `Team lead: ${registration.organization || registration.lastName || registration.reference}`,
        amount: '',
        pipeline: env('HUBSPOT_TEAM_PIPELINE_ID'),
        stage: env('HUBSPOT_TEAM_STAGE_NEW'),
        description: describeBooking(registration),
        contactId,
      }).catch((err) => console.error('[hubspot] team deal failed:', err?.message));
    }

    return { sent: true, dealId, contactId };
  } catch (err) {
    console.error('[hubspot] booking not sent:', err?.message);
    return { sent: false, reason: err?.message };
  }
}

/** The booking was paid: move its deal to the tier's paid stage. */
export async function onBookingPaid(registration) {
  if (!isHubspotConfigured()) return { sent: false, reason: 'not configured' };
  const stage = env(PAID_STAGE[registration.track] || '');
  if (!registration.hubspotDealId || !stage) return { sent: false, reason: 'no deal or no stage' };
  try {
    await hubspot(`/crm/v3/objects/deals/${registration.hubspotDealId}`, {
      method: 'PATCH',
      body: { properties: { dealstage: stage, amount: String(reportedValue(registration)) } },
    });
    return { sent: true };
  } catch (err) {
    console.error('[hubspot] payment not sent:', err?.message);
    return { sent: false, reason: err?.message };
  }
}

/** A team or private training enquiry from /ai-training/teams. */
export async function onTeamEnquiry(enquiry) {
  if (!env('HUBSPOT_PRIVATE_APP_TOKEN') || !env('HUBSPOT_TEAM_PIPELINE_ID') || !env('HUBSPOT_TEAM_STAGE_NEW')) {
    return { sent: false, reason: 'not configured' };
  }
  try {
    const [firstName, ...rest] = String(enquiry.name || '').split(' ');
    const contactId = await upsertContact({
      email: enquiry.email,
      firstName,
      lastName: rest.join(' '),
      phone: enquiry.phone,
      company: enquiry.organization,
      jobTitle: enquiry.role,
    });
    const dealId = await createDeal({
      name: `Team training: ${enquiry.organization} (${enquiry.teamSize} people)`,
      amount: '',
      pipeline: env('HUBSPOT_TEAM_PIPELINE_ID'),
      stage: env('HUBSPOT_TEAM_STAGE_NEW'),
      description: [
        `Format: ${enquiry.format}`,
        enquiry.preferredMonth ? `Preferred month: ${enquiry.preferredMonth}` : null,
        enquiry.utm ? `Ad source: ${enquiry.utm}` : null,
        enquiry.message || null,
      ]
        .filter(Boolean)
        .join('\n'),
      contactId,
    });
    return { sent: true, dealId };
  } catch (err) {
    console.error('[hubspot] team enquiry not sent:', err?.message);
    return { sent: false, reason: err?.message };
  }
}

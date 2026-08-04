'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

import {
  AI_EXPERIENCE,
  AI_TOOLS,
  ATTENDANCE_OPTIONS,
  CONSENT_TEXT,
  INDUSTRIES,
  MASTERCLASS_TOPICS,
  REFERRAL_SOURCES,
  TIME_CONSUMING_TASKS,
  validateRegistration,
} from '@/lib/registration-form';
import { TRACK_WBH, formatKes } from '@/lib/training';

import {
  Checkbox,
  CheckboxGroup,
  Field,
  FormSection,
  RadioCards,
  Select,
  TextArea,
  TextInput,
} from './fields';

/**
 * The registration form for both tracks.
 *
 * The individual track asks the full set of questions — the same ones the Zoom
 * pre-registration used, because those answers genuinely shape what gets taught.
 * The masterclass track asks far less: those attendees already answered all of
 * that when they signed up for the free webinar, so re-asking would be rude and
 * would cost conversions. It only collects what is new since then.
 */
export function RegistrationForm({ track, cohorts = [], price }) {
  const router = useRouter();
  const isMasterclass = track === TRACK_WBH;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    city: '',
    industry: '',
    attendance: isMasterclass ? 'in-person' : 'in-person',
    cohortId: cohorts[0]?.id || '',
    aiExperience: '',
    aiTools: [],
    timeConsumingTasks: [],
    topicPriorities: [],
    biggestChallenge: '',
    goal: '',
    liveChallenge: '',
    dietary: '',
    referralSource: '',
    deviceReady: true,
    whatsappOptIn: true,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error as soon as they start fixing it, not on the next submit.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const setInput = (field) => (event) => set(field)(event.target.value);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const payload = { ...form, track };
    const local = validateRegistration(payload);
    if (!local.ok) {
      setErrors(local.errors);
      // Take them to the first problem rather than leaving them hunting for it.
      const firstField = Object.keys(local.errors)[0];
      document.getElementById(`field-${firstField}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        setFormError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(data.checkoutUrl);
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-11" noValidate>
      <FormSection
        step={1}
        title="About you"
        description={
          isMasterclass
            ? 'Just enough to match you to your free-webinar registration.'
            : 'So we know who is coming and can send your joining details.'
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div id="field-firstName">
            <Field label="First name" required error={errors.firstName} htmlFor="firstName">
              <TextInput
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={form.firstName}
                onChange={setInput('firstName')}
                error={errors.firstName}
                placeholder="Amina"
              />
            </Field>
          </div>
          <div id="field-lastName">
            <Field label="Last name" required error={errors.lastName} htmlFor="lastName">
              <TextInput
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={form.lastName}
                onChange={setInput('lastName')}
                error={errors.lastName}
                placeholder="Wanjiru"
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div id="field-email">
            <Field
              label="Email"
              required
              error={errors.email}
              htmlFor="email"
              hint="Your confirmation and preparation pack go here."
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={setInput('email')}
                error={errors.email}
                placeholder="you@business.co.ke"
              />
            </Field>
          </div>
          <div id="field-phone">
            <Field
              label="M-Pesa phone number"
              required
              error={errors.phone}
              htmlFor="phone"
              hint="We send the payment prompt to this number."
            >
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={setInput('phone')}
                error={errors.phone}
                placeholder="0712 345 678"
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business or organisation" htmlFor="organization">
            <TextInput
              id="organization"
              name="organization"
              autoComplete="organization"
              value={form.organization}
              onChange={setInput('organization')}
              placeholder="Royaume Enterprises"
            />
          </Field>
          <Field label="Your role" htmlFor="jobTitle">
            <TextInput
              id="jobTitle"
              name="jobTitle"
              autoComplete="organization-title"
              value={form.jobTitle}
              onChange={setInput('jobTitle')}
              placeholder="Founder"
            />
          </Field>
        </div>

        {!isMasterclass && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" htmlFor="city">
              <TextInput
                id="city"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={setInput('city')}
                placeholder="Nairobi"
              />
            </Field>
            <Field label="Industry" htmlFor="industry">
              <Select id="industry" value={form.industry} onChange={setInput('industry')}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        )}
      </FormSection>

      {!isMasterclass && (
        <FormSection
          step={2}
          title="Choose your dates"
          description="Two Saturdays, 9:00am–1:00pm each. Pick the pair that suits you."
        >
          <div id="field-cohortId">
            <Field label="Cohort" required error={errors.cohortId} htmlFor="cohortId">
              <Select
                id="cohortId"
                value={form.cohortId}
                onChange={setInput('cohortId')}
                error={errors.cohortId}
              >
                <option value="">Select your dates</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div id="field-attendance">
            <Field label="How would you like to attend?" required error={errors.attendance}>
              <RadioCards
                name="attendance"
                value={form.attendance}
                onChange={set('attendance')}
                error={errors.attendance}
                options={[
                  {
                    value: 'in-person',
                    label: 'In person, Nairobi',
                    description: 'Delta Annex, Delta Corner, Waiyaki Way',
                  },
                  {
                    value: 'online',
                    label: 'Online via Zoom',
                    description: 'Same session, joining link sent the day before',
                  },
                ]}
              />
            </Field>
          </div>
        </FormSection>
      )}

      <FormSection
        step={isMasterclass ? 2 : 3}
        title={isMasterclass ? 'Make the day count for you' : 'Help us tailor the training'}
        description={
          isMasterclass
            ? 'You told us about your business when you signed up for the free webinar — we still have all of that. These few answers are what shape the day itself.'
            : 'Every answer here changes what we spend time on. None of it is required, but the more you tell us, the more the day is about your work.'
        }
      >
        {isMasterclass ? (
          <>
            <Field
              label="Which of these do you most want to walk out with?"
              hint="Pick as many as you like. The most-picked modules get the most floor time."
            >
              <CheckboxGroup
                options={MASTERCLASS_TOPICS}
                value={form.topicPriorities}
                onChange={set('topicPriorities')}
                columns={1}
              />
            </Field>

            <Field
              label="What have you tried since the webinar?"
              hint="Even “nothing yet” is useful — it tells us where to start."
              htmlFor="goal"
            >
              <TextArea
                id="goal"
                value={form.goal}
                onChange={setInput('goal')}
                placeholder="I tried the social media prompt and got a week of posts, but the captions did not sound like me…"
              />
            </Field>
          </>
        ) : (
          <>
            <div id="field-aiExperience">
              <Field
                label="Have you used an AI tool before?"
                required
                error={errors.aiExperience}
                htmlFor="aiExperience"
                hint="ChatGPT, Gemini, Canva AI, Copilot, Claude — anything counts."
              >
                <Select
                  id="aiExperience"
                  value={form.aiExperience}
                  onChange={setInput('aiExperience')}
                  error={errors.aiExperience}
                >
                  <option value="">Select one</option>
                  {AI_EXPERIENCE.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Which have you tried?">
              <CheckboxGroup options={AI_TOOLS} value={form.aiTools} onChange={set('aiTools')} />
            </Field>

            <Field label="Which tasks take up most of your time?">
              <CheckboxGroup
                options={TIME_CONSUMING_TASKS}
                value={form.timeConsumingTasks}
                onChange={set('timeConsumingTasks')}
              />
            </Field>

            <Field
              label="What is the biggest challenge in running or growing your business right now?"
              htmlFor="biggestChallenge"
            >
              <TextArea
                id="biggestChallenge"
                value={form.biggestChallenge}
                onChange={setInput('biggestChallenge')}
                placeholder="Mondays and Tuesdays are very quiet and I lose money on those days…"
              />
            </Field>

            <Field label="What would make this training most valuable for you?" htmlFor="goal">
              <TextArea
                id="goal"
                value={form.goal}
                onChange={setInput('goal')}
                placeholder="I want to stop spending my evenings writing proposals."
              />
            </Field>
          </>
        )}

        <Field
          label="Bring one real task and we will solve it live"
          hint="The one thing you would love to hand over. We build it together on the day."
          htmlFor="liveChallenge"
        >
          <TextArea
            id="liveChallenge"
            value={form.liveChallenge}
            onChange={setInput('liveChallenge')}
            placeholder="Responding to tenders — it takes me a whole weekend every time."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={isMasterclass ? 'Dietary needs' : 'Dietary or accessibility needs'}
            hint={isMasterclass ? 'Lunch and refreshments are provided.' : 'Anything we should know.'}
            htmlFor="dietary"
          >
            <TextInput
              id="dietary"
              value={form.dietary}
              onChange={setInput('dietary')}
              placeholder="Vegetarian"
            />
          </Field>

          {!isMasterclass && (
            <Field label="How did you hear about us?" htmlFor="referralSource">
              <Select
                id="referralSource"
                value={form.referralSource}
                onChange={setInput('referralSource')}
              >
                <option value="">Select one</option>
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        <Checkbox id="deviceReady" checked={form.deviceReady} onChange={set('deviceReady')}>
          I will bring a laptop and charger. <span className="text-white/45">This is 100% hands-on — you cannot build on a phone.</span>
        </Checkbox>
      </FormSection>

      <FormSection step={isMasterclass ? 3 : 4} title="Confirm and pay">
        <Checkbox id="whatsappOptIn" checked={form.whatsappOptIn} onChange={set('whatsappOptIn')}>
          Send me reminders and joining details on WhatsApp too. <span className="text-white/45">Most people read these; email sometimes hides.</span>
        </Checkbox>

        <div id="field-consent">
          <Checkbox id="consent" checked={form.consent} onChange={set('consent')} error={errors.consent}>
            {CONSENT_TEXT}
          </Checkbox>
        </div>

        {formError && (
          <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-white">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button type="submit" disabled={submitting} className="btn-ember text-base disabled:opacity-60">
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving your place…
              </>
            ) : (
              <>
                Continue to payment · {formatKes(price)} <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="flex items-center gap-2 text-[13px] text-white/45">
            <ShieldCheck size={15} className="text-ember" />
            M-Pesa or card. Nothing is charged until the next step.
          </p>
        </div>
      </FormSection>
    </form>
  );
}

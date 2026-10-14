'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

import {
  AI_EXPERIENCE,
  AI_TOOLS,
  BUYER_TYPES,
  CONSENT_TEXT,
  HEADCOUNT_MAX,
  INDUSTRIES,
  REFERRAL_SOURCES,
  TIME_CONSUMING_TASKS,
  assistantFor,
  formShapeFor,
  validateRegistration,
} from '@/lib/registration-form';
import { readStoredAttribution } from '@/components/UtmCapture';
import { trackLead } from '@/lib/analytics/funnel';
import { TRACKS, TRACK_ESSENTIALS, TRACK_PROGRAMME, formatKes } from '@/lib/training';

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
 * The registration form, one version per tier.
 *
 *   Kickstart   name, email, M-Pesa number, the Wednesday, consent.
 *   Essentials  adds the date, attendance, who they are, headcount, where their
 *               time goes and AI experience, plus a credit code.
 *   Programme   the full questionnaire, because those answers genuinely shape
 *               what gets taught, plus a credit code.
 *
 * `dates` is the list the buyer picks from: Kickstart sessions, or cohorts
 * (each with `dayOne` and `dayTwo`). Every class is paid in full at checkout.
 */
export function RegistrationForm({ track, dates = [], price, initialCreditCode = '' }) {
  const router = useRouter();
  const shape = formShapeFor(track);
  const isEssentials = track === TRACK_ESSENTIALS;
  const isProgramme = track === TRACK_PROGRAMME;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    city: '',
    industry: '',
    attendance: shape.kickstart ? 'online' : 'in-person',
    cohortId: dates[0]?.id || '',
    buyerType: '',
    headcount: '1',
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
    creditCode: initialCreditCode,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  // Credit preview: { amountKes, payKes, expiresAt, message } once checked.
  const [credit, setCredit] = useState(null);
  const [creditState, setCreditState] = useState('idle'); // idle | checking | applied | none

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error as soon as they start fixing it, not on the next submit.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    if (field === 'creditCode' && creditState !== 'idle') {
      setCredit(null);
      setCreditState('idle');
    }
  };

  const setInput = (field) => (event) => set(field)(event.target.value);

  // An Essentials credit pays for Day One, so its holder picks a Day Two, and
  // only one that falls before the credit ends. The server enforces the same.
  const dayTwoOnly = isProgramme && credit?.amountKes === TRACKS[TRACK_ESSENTIALS].credit.amountKes;
  const dateOptions = useMemo(() => {
    if (!dayTwoOnly) return dates;
    const until = credit.expiresAt.slice(0, 10);
    return dates.filter((d) => d.dayTwo && d.dayTwo <= until).map((d) => ({ ...d, label: d.dayTwoLabel }));
  }, [dates, dayTwoOnly, credit]);

  const payable = credit?.payKes ?? price;
  const assistant = assistantFor(form.timeConsumingTasks);

  async function applyCredit() {
    const code = form.creditCode.trim();
    if (!code) return;
    if (!form.phone && !form.email) {
      setErrors((prev) => ({ ...prev, creditCode: 'Enter your M-Pesa number or email above first.' }));
      return;
    }
    setCreditState('checking');
    try {
      const res = await fetch('/api/credits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, phone: form.phone, email: form.email, tier: TRACKS[track].param }),
      });
      const data = await res.json();
      if (data.ok) {
        setCredit(data);
        setCreditState('applied');
        // Day Two dates differ from the pair the buyer may have picked.
        if (isProgramme && data.amountKes === TRACKS[TRACK_ESSENTIALS].credit.amountKes) {
          const first = dates.find((d) => d.dayTwo && d.dayTwo <= data.expiresAt.slice(0, 10));
          setForm((prev) => ({ ...prev, cohortId: first?.id || '' }));
        }
      } else {
        setCredit(null);
        setCreditState('none');
        setErrors((prev) => ({
          ...prev,
          creditCode:
            data.error ||
            'We could not find a credit for that code with this phone number or email. Check the code, or leave it empty.',
        }));
      }
    } catch {
      setCreditState('idle');
      setErrors((prev) => ({ ...prev, creditCode: 'We could not check that code. Try again, or leave it empty.' }));
    }
  }

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
        // pageUrl is ignored by validation. The server reads it only to recover
        // the Meta click id when the pixel cookie is missing, so that a sale
        // confirmed days later still points back at the ad that caused it.
        // attribution carries the UTM tags and click ids from the visitor's first
        // landing (UtmCapture), so the booking can say which ad sent it.
        body: JSON.stringify({
          ...payload,
          pageUrl: window.location.href,
          attribution: readStoredAttribution(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        setFormError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // The server sends the same Lead through the Conversions API with the
      // same event id, so Meta keeps one. The value is the list price less any
      // credit, as the server reports it.
      trackLead({
        reference: data.reference,
        track,
        name: TRACKS[track]?.name,
        value: Math.max((data.listPrice ?? price) - (data.creditApplied?.amountKes || 0), 0),
      });
      router.push(data.checkoutUrl);
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  let step = 0;
  const nextStep = () => {
    step += 1;
    return step;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-11" noValidate>
      <FormSection
        step={nextStep()}
        title="About you"
        description={
          shape.kickstart
            ? 'Your Google Meet link and the prompts from the session go to these.'
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
              hint="Your confirmation and joining details go here."
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

        {shape.fullQuestionnaire && (
          <>
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
          </>
        )}
      </FormSection>

      {shape.credit && (
        <FormSection
          step={nextStep()}
          title="Already paid for a class?"
          description={
            isEssentials
              ? 'Did the Ksh 500 Kickstart in the last 14 days? It counts here.'
              : 'A Kickstart counts for 14 days and Essentials for 60 days.'
          }
        >
          <div id="field-creditCode">
            <Field
              label="Credit code or M-Pesa code"
              error={errors.creditCode}
              htmlFor="creditCode"
              hint="The CR- code we sent you, or the M-Pesa code from your payment SMS. Leave it empty if you have none: we also check your phone number and email."
            >
              <div className="flex gap-2">
                <TextInput
                  id="creditCode"
                  name="creditCode"
                  value={form.creditCode}
                  onChange={setInput('creditCode')}
                  error={errors.creditCode}
                  placeholder="CR-7F3K2M"
                  autoCapitalize="characters"
                  className="uppercase"
                />
                <button
                  type="button"
                  onClick={applyCredit}
                  disabled={!form.creditCode.trim() || creditState === 'checking'}
                  className="btn-ghost shrink-0 px-5 disabled:opacity-50"
                >
                  {creditState === 'checking' ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                </button>
              </div>
            </Field>
            {credit && <p className="mt-2 text-sm text-ember">{credit.message}</p>}
          </div>
        </FormSection>
      )}

      <FormSection
        step={nextStep()}
        title={shape.kickstart ? 'Choose your Wednesday' : dayTwoOnly ? 'Choose your Day Two' : 'Choose your dates'}
        description={
          shape.kickstart
            ? '7:00pm to 9:00pm, live on Google Meet.'
            : isEssentials
              ? 'One Saturday, 9:00am to 1:00pm.'
              : dayTwoOnly
                ? 'Your Essentials Saturday was Day One. Pick the Saturday for Day Two, 9:00am to 1:00pm.'
                : 'Two Saturdays, 9:00am to 1:00pm each. Pick the pair that suits you.'
        }
      >
        <div id="field-cohortId">
          <Field
            label={shape.kickstart ? 'Session' : isEssentials ? 'Saturday' : 'Dates'}
            required
            error={errors.cohortId}
            htmlFor="cohortId"
          >
            <Select id="cohortId" value={form.cohortId} onChange={setInput('cohortId')} error={errors.cohortId}>
              <option value="">Select a date</option>
              {dateOptions.map((date) => (
                <option key={date.id} value={date.id}>
                  {date.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {!shape.kickstart && (
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
                    description: 'Delta Annex, Delta Corner, Westlands',
                  },
                  {
                    value: 'online',
                    label: 'Online via Google Meet',
                    description: 'Same session, joining link sent the day before',
                  },
                ]}
              />
            </Field>
          </div>
        )}
      </FormSection>

      {shape.profile && (
        <FormSection
          step={nextStep()}
          title="Help us tailor the session"
          description="Where your time goes decides the AI assistant you build on the day."
        >
          <div id="field-buyerType">
            <Field label="Which best describes you?" required error={errors.buyerType}>
              <RadioCards
                name="buyerType"
                value={form.buyerType}
                onChange={set('buyerType')}
                error={errors.buyerType}
                options={BUYER_TYPES}
              />
            </Field>
          </div>

          <div id="field-headcount" className="max-w-xs">
            <Field
              label="How many people are you registering?"
              required
              error={errors.headcount}
              htmlFor="headcount"
              hint="Three or more? We will call you about a team rate."
            >
              <TextInput
                id="headcount"
                type="number"
                inputMode="numeric"
                min={1}
                max={HEADCOUNT_MAX}
                value={form.headcount}
                onChange={setInput('headcount')}
                error={errors.headcount}
              />
            </Field>
          </div>

          <div id="field-timeConsumingTasks">
            <Field label="Where does most of your time go?" required error={errors.timeConsumingTasks}>
              <CheckboxGroup
                options={TIME_CONSUMING_TASKS}
                value={form.timeConsumingTasks}
                onChange={set('timeConsumingTasks')}
              />
            </Field>
            {assistant && (
              <p className="mt-2 text-sm text-white/65">
                You will build: <span className="text-ember">{assistant}</span>
              </p>
            )}
          </div>

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

          {shape.fullQuestionnaire && (
            <>
              <Field label="Which have you tried?">
                <CheckboxGroup options={AI_TOOLS} value={form.aiTools} onChange={set('aiTools')} />
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
                <Field label="Dietary or accessibility needs" hint="Anything we should know." htmlFor="dietary">
                  <TextInput
                    id="dietary"
                    value={form.dietary}
                    onChange={setInput('dietary')}
                    placeholder="Vegetarian"
                  />
                </Field>

                <Field label="How did you hear about us?" htmlFor="referralSource">
                  <Select id="referralSource" value={form.referralSource} onChange={setInput('referralSource')}>
                    <option value="">Select one</option>
                    {REFERRAL_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </>
          )}

          <Checkbox id="deviceReady" checked={form.deviceReady} onChange={set('deviceReady')}>
            I will bring a laptop and charger.{' '}
            <span className="text-white/65">Every session is hands-on, and building on a phone is hard.</span>
          </Checkbox>
        </FormSection>
      )}

      <FormSection step={nextStep()} title="Confirm and pay">
        <Checkbox id="whatsappOptIn" checked={form.whatsappOptIn} onChange={set('whatsappOptIn')}>
          Send me reminders and joining details on WhatsApp too.{' '}
          <span className="text-white/65">Most people read these; email sometimes hides.</span>
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
                Continue to payment · {formatKes(payable)} <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="flex items-center gap-2 text-[13px] text-white/65">
            <ShieldCheck size={15} className="text-ember" />
            Paid in full at the next step. Nothing is charged until then.
          </p>
        </div>
      </FormSection>
    </form>
  );
}

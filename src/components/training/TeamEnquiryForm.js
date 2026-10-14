'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { trackPixel } from '@/components/MetaPixelClient';
import { trackGoogle } from '@/components/GoogleTagRouteViews';
import { readStoredAttribution } from '@/components/UtmCapture';
import { META_EVENTS } from '@/lib/meta/events';

import { Field, Select, TextArea, TextInput } from './fields';

const FORMAT_OPTIONS = [
  ['team-programme', 'Team programme (8 hours)'],
  ['private', 'Private one-to-one'],
  ['executive', 'Executive briefing'],
  ['copilot', 'Microsoft 365 and Copilot'],
  ['demo', 'Free demonstration'],
  ['unsure', 'Not sure yet'],
];

/** The team and private training enquiry form on /ai-training/teams. */
export function TeamEnquiryForm() {
  const [form, setForm] = useState({
    name: '',
    organization: '',
    role: '',
    email: '',
    phone: '',
    teamSize: '',
    format: 'team-programme',
    preferredMonth: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [formError, setFormError] = useState('');

  const set = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function submit(event) {
    event.preventDefault();
    setFormError('');
    setState('sending');
    try {
      const res = await fetch('/api/team-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pageUrl: window.location.href, attribution: readStoredAttribution() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setFormError(data.error || 'Something went wrong. Please try again.');
        setState('idle');
        return;
      }
      // Same event id as the server's Lead, so Meta keeps one.
      trackPixel(META_EVENTS.lead, { content_category: 'Team training' }, { eventID: data.eventId });
      trackGoogle('generate_lead', { tier: 'team', team_size: Number(form.teamSize) || 0 });
      setState('sent');
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.');
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <div className="card-dark p-8 text-center">
        <CheckCircle2 size={32} className="mx-auto text-ember" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-white">Thank you. We will call you today.</h3>
        <p className="mt-2 text-white/65">If it is after hours, we call the next working morning.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card-dark space-y-5 p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required error={errors.name} htmlFor="te-name">
          <TextInput id="te-name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        </Field>
        <Field label="Organisation" required error={errors.organization} htmlFor="te-org">
          <TextInput id="te-org" autoComplete="organization" value={form.organization} onChange={set('organization')} error={errors.organization} />
        </Field>
        <Field label="Your role" htmlFor="te-role">
          <TextInput id="te-role" autoComplete="organization-title" value={form.role} onChange={set('role')} />
        </Field>
        <Field label="Team size" required error={errors.teamSize} htmlFor="te-size">
          <TextInput id="te-size" type="number" inputMode="numeric" min={1} value={form.teamSize} onChange={set('teamSize')} error={errors.teamSize} />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor="te-email">
          <TextInput id="te-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        </Field>
        <Field label="Phone" required error={errors.phone} htmlFor="te-phone">
          <TextInput id="te-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="0712 345 678" />
        </Field>
        <Field label="Format" htmlFor="te-format">
          <Select id="te-format" value={form.format} onChange={set('format')}>
            {FORMAT_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Preferred month" htmlFor="te-month">
          <TextInput id="te-month" value={form.preferredMonth} onChange={set('preferredMonth')} placeholder="November" />
        </Field>
      </div>
      <Field label="Anything we should know?" htmlFor="te-message">
        <TextArea id="te-message" value={form.message} onChange={set('message')} placeholder="The reports and tenders your team spends most time on." />
      </Field>
      {formError && (
        <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-white">
          {formError}
        </p>
      )}
      <button type="submit" disabled={state === 'sending'} className="btn-ember w-full text-base sm:w-auto disabled:opacity-60">
        {state === 'sending' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          'Send the enquiry'
        )}
      </button>
    </form>
  );
}

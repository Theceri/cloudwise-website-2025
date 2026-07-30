'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Form primitives for the registration flow, styled for the dark site theme.
 *
 * Kept here rather than in components/ui because these carry the flow's own
 * conventions — visible error text under every field, generous tap targets for
 * the phone-first audience, and labels that read like a person asking.
 */

const inputBase =
  'w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder-white/30 ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember/50';

export function Field({ label, hint, error, required, htmlFor, children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-white/85">
          {label}
          {required && <span className="ml-1 text-ember">*</span>}
        </label>
      )}
      {hint && <p className="text-[13px] leading-relaxed text-white/45">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-[13px] font-medium text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ error, className, ...props }) {
  return (
    <input
      {...props}
      aria-invalid={error ? 'true' : undefined}
      className={cn(inputBase, error ? 'border-ember/60' : 'border-white/10', className)}
    />
  );
}

export function TextArea({ error, className, rows = 3, ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      aria-invalid={error ? 'true' : undefined}
      className={cn(inputBase, 'resize-y', error ? 'border-ember/60' : 'border-white/10', className)}
    />
  );
}

export function Select({ error, className, children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          inputBase,
          'appearance-none pr-11',
          // Native option lists inherit the page background in some browsers and
          // the OS default in others; forcing both keeps them readable.
          '[&>option]:bg-ink [&>option]:text-white',
          error ? 'border-ember/60' : 'border-white/10',
          className
        )}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
        ▾
      </span>
    </div>
  );
}

/** Big tappable alternatives — used for attendance format. */
export function RadioCards({ name, options, value, onChange, error }) {
  return (
    <div
      role="radiogroup"
      aria-invalid={error ? 'true' : undefined}
      className="grid gap-3 sm:grid-cols-2"
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
              selected
                ? 'border-ember bg-ember/10'
                : 'border-white/10 bg-white/[0.03] hover:border-white/25'
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                selected ? 'border-ember bg-ember text-white' : 'border-white/25'
              )}
            >
              {selected && <Check size={12} strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-[15px] font-medium text-white">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-[13px] text-white/50">{option.description}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select chips. Compact enough to show a dozen options without a wall. */
export function CheckboxGroup({ options, value = [], onChange, columns = 2 }) {
  const toggle = (option) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <div className={cn('grid gap-2', columns === 1 ? 'grid-cols-1' : 'sm:grid-cols-2')}>
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(option)}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-all',
              selected
                ? 'border-ember bg-ember/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25'
            )}
          >
            <span
              className={cn(
                'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border',
                selected ? 'border-ember bg-ember text-white' : 'border-white/25'
              )}
            >
              {selected && <Check size={11} strokeWidth={3} />}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function Checkbox({ checked, onChange, children, error, id }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
          error ? 'border-ember/60' : 'border-white/10 bg-white/[0.03] hover:border-white/20'
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={cn(
            'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border',
            checked ? 'border-ember bg-ember text-white' : 'border-white/25'
          )}
        >
          {checked && <Check size={11} strokeWidth={3} />}
        </span>
        <span className="text-[13px] leading-relaxed text-white/70">{children}</span>
      </label>
      {error && (
        <p role="alert" className="text-[13px] font-medium text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormSection({ step, title, description, children }) {
  return (
    <section className="border-t border-white/10 pt-9 first:border-0 first:pt-0">
      <div className="mb-6">
        <p className="eyebrow mb-2">Step {step}</p>
        <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-2 text-[15px] text-white/55">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

import { TRAINED_ORGANISATIONS } from '@/lib/training-content';

/**
 * Who teaches the course. A named trainer is the single biggest trust gap the
 * content audit found (14 October 2026).
 *
 * The photo and the credentials line are left out until Paul supplies them
 * (plan step 0.7): an initials monogram stands in for the photo, and no
 * credential is claimed that the site cannot evidence.
 */
export function TrainerCard() {
  return (
    <div className="card-dark flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
      <div
        aria-hidden="true"
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember/10 font-display text-2xl font-bold text-ember"
      >
        PT
      </div>
      <div>
        <p className="eyebrow-muted">Your trainer</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-white">Paul Theceri Ng’ang’a</h3>
        <p className="text-sm text-white/65">Director, Cloudwise Limited</p>
        <p className="mt-3 text-[15px] leading-relaxed text-white/75">
          Builds AI products for Kenyan businesses at Cloudwise, and teaches the same methods used on that work
          every day. Has trained teams at {TRAINED_ORGANISATIONS.slice(0, -1).join(', ')} and{' '}
          {TRAINED_ORGANISATIONS.at(-1)}.
        </p>
      </div>
    </div>
  );
}

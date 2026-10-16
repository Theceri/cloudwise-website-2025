import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Verify a certificate',
  robots: { index: false, follow: true },
};

/** Type a certificate code; the form sends you to /verify/<code>. */
async function lookUp(formData) {
  'use server';
  const code = String(formData.get('code') || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 20);
  if (code) redirect(`/verify/${code}`);
}

export default function VerifyIndexPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <form action={lookUp} className="card-dark mx-auto max-w-lg p-8">
          <p className="eyebrow">Certificate check</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Verify a Cloudwise certificate</h1>
          <p className="mt-3 text-white/65">Enter the code printed on the certificate, for example CW-7F3K2M9P.</p>
          <label htmlFor="code" className="mt-6 block text-sm font-medium text-white/85">
            Certificate code
          </label>
          <input
            id="code"
            name="code"
            required
            autoCapitalize="characters"
            placeholder="CW-XXXXXXXX"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 uppercase text-white placeholder-white/30 focus:border-ember/50 focus:outline-none focus:ring-2 focus:ring-ember/50"
          />
          <button type="submit" className="btn-ember mt-5 w-full text-base">
            Check the certificate
          </button>
        </form>
      </div>
    </section>
  );
}

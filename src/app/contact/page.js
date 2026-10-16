'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Star, Loader2 } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { COMPANY_INFO, SOCIAL_LINKS, WHATSAPP_NUMBER_RAW, formatAddress } from '@/lib/constants';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const send = (e) => {
    e?.preventDefault();
    const msg = encodeURIComponent(
      `New enquiry from the website\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\n\n${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${msg}`, '_blank');
    toast.success('Opening WhatsApp to send your message…');
  };

  // Not everyone uses WhatsApp for work, and the WhatsApp route leaves us no
  // copy if the visitor closes it unsent. This sends the same message by email.
  const sendEmail = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please add your name, email and message.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send.');
      toast.success('Thank you. Your message is with us, and we reply within 24 hours.');
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Could not send. Please try WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let’s talk about what you’re building."
        subtitle="Have a project, a question, or want to book AI training? Reach us however suits you — we reply within 24 hours."
      />

      {/* Contact methods */}
      <section className="border-t border-white/10 bg-ink py-16">
        <div className="container-px grid gap-4 sm:grid-cols-3">
          {[
            { icon: Phone, label: 'Call us', value: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phoneRaw}` },
            { icon: Mail, label: 'Email us', value: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
            { icon: MapPin, label: 'Visit us', value: formatAddress(), href: COMPANY_INFO.directionsUrl },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="card-dark group flex h-full items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
                  <c.icon size={20} />
                </div>
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/40">{c.label}</p>
                  <p className="font-medium text-white">{c.value}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="border-t border-white/10 bg-ink-800/30 py-20 md:py-28">
        <div className="container-px grid gap-8 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={send} className="card-dark p-8">
              <p className="eyebrow mb-2">Send a message</p>
              <h2 className="mb-7 font-display text-2xl font-bold text-white">We’d love to hear from you.</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="name" value={form.name} onChange={set} required placeholder="Your name" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30" />
                  <input name="email" type="email" value={form.email} onChange={set} required placeholder="Email" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="phone" type="tel" value={form.phone} onChange={set} placeholder="Phone" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30" />
                  <input name="company" value={form.company} onChange={set} placeholder="Company" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30" />
                </div>
                <textarea name="message" value={form.message} onChange={set} required rows={5} placeholder="Tell us about your project…" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="submit" className="btn-ember w-full">
                    Send via WhatsApp <Send size={16} />
                  </button>
                  <button type="button" onClick={sendEmail} disabled={sending} className="btn-ghost w-full disabled:opacity-60">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} Send by email
                  </button>
                </div>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                /* A pin on the Google Business Profile location at Delta Annex,
                   Westlands. The old embed was centred on the CBD, about 3 km away. */
                src={`https://www.google.com/maps?q=${COMPANY_INFO.geo.lat},${COMPANY_INFO.geo.lng}&z=17&output=embed`}
                width="100%"
                height="380"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) contrast(0.9)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cloudwise Limited, Delta Annex, Westlands, Nairobi"
              />
            </div>
            <div className="card-dark space-y-3 p-6 text-sm text-white/70">
              <p>
                <strong className="text-white">Finding us.</strong> Delta Annex is next to Delta Corner Towers on
                Waiyaki Way, Westlands. Take the lift to the 4th floor. Training days run in the 4th-floor training
                room.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a href={COMPANY_INFO.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">
                  Get directions
                </a>
                <a href={COMPANY_INFO.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ember hover:underline">
                  <Star size={14} fill="currentColor" /> Read our Google reviews
                </a>
              </div>
            </div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER_RAW}`} target="_blank" rel="noopener noreferrer" className="card-dark group flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 text-ember"><MessageCircle size={20} /></div>
                <div>
                  <p className="font-display font-semibold text-white">Prefer WhatsApp?</p>
                  <p className="text-sm text-white/55">Chat with us directly — fastest response.</p>
                </div>
              </div>
              <span className="text-sm text-ember">Open chat →</span>
            </a>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-center text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white">
                  {s.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

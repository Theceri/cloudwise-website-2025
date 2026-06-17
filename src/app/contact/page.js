'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { COMPANY_INFO, SOCIAL_LINKS, WHATSAPP_NUMBER_RAW } from '@/lib/constants';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const send = (e) => {
    e?.preventDefault();
    const msg = `New enquiry from the website%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ACompany: ${form.company}%0A%0A${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${msg}`, '_blank');
    toast.success('Opening WhatsApp to send your message…');
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
            { icon: MapPin, label: 'Visit us', value: `${COMPANY_INFO.address.line1}, ${COMPANY_INFO.address.city}`, href: 'https://maps.google.com/?q=Cloudwise+Technologies+Nairobi' },
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
                <button type="submit" className="btn-ember w-full">
                  Send via WhatsApp <Send size={16} />
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8149482568783!2d36.821452873727544!3d-1.2849942356221171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11e00adb9341%3A0xd63201e2d4bae3ae!2sCloudwise%20Technologies!5e0!3m2!1sen!2ske!4v1748416706423!5m2!1sen!2ske"
                width="100%"
                height="380"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) contrast(0.9)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cloudwise Technologies location"
              />
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

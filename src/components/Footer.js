'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { NAVIGATION_LINKS, COMPANY_INFO, SOCIAL_LINKS, whatsappLink } from '@/lib/constants';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-ember/10 blur-3xl" />

      {/* CTA band */}
      <div className="container-px pt-16 md:pt-24">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Let&apos;s build something</p>
            <h2 className="max-w-xl text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Ready to work smarter with technology?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-ember">
              Start a project <ArrowUpRight size={18} />
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-px grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <BrandLogo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {COMPANY_INFO.tagline} Nairobi-based, building for businesses across East Africa since {COMPANY_INFO.founded}.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="flex items-center gap-3 text-white/65 transition-colors hover:text-ember">
              <Phone size={16} className="text-ember" /> {COMPANY_INFO.phone}
            </a>
            <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-3 text-white/65 transition-colors hover:text-ember">
              <Mail size={16} className="text-ember" /> {COMPANY_INFO.email}
            </a>
            <p className="flex items-center gap-3 text-white/65">
              <MapPin size={16} className="text-ember" /> {COMPANY_INFO.address.line1}, {COMPANY_INFO.address.city}
            </p>
          </div>
        </div>

        <div>
          <h3 className="eyebrow-muted mb-5">Explore</h3>
          <ul className="space-y-3 text-sm">
            {NAVIGATION_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/60 transition-colors hover:text-white link-underline">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow-muted mb-5">Services</h3>
          <ul className="space-y-3 text-sm">
            {[
              ['AI Agent Development', '/services/ai'],
              ['Web Development', '/services/web'],
              ['Mobile Apps', '/services/mobile'],
              ['Cloud Solutions', '/services/cloud'],
              ['AI Training', '/ai-training'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/60 transition-colors hover:text-white link-underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow-muted mb-5">Follow</h3>
          <ul className="space-y-3 text-sm">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white"
                >
                  {s.name}
                  <ArrowUpRight size={13} className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-px flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-white/40 md:flex-row">
        <p>© {new Date().getFullYear()} {COMPANY_INFO.legalName}. All rights reserved.</p>
        <p className="font-mono uppercase tracking-eyebrow">Your ICT partner — Nairobi, KE</p>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { BrandLogo } from './BrandLogo';
import QuoteForm from './QuoteForm';
import { Magnetic } from './anim/Magnetic';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-white/10 bg-ink/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <nav className="container-px flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Cloudwise home" className="shrink-0">
            <BrandLogo priority />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAVIGATION_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm transition-colors',
                    active ? 'text-white' : 'text-white/60 hover:text-white',
                    link.highlight && !active && 'text-ember/90 hover:text-ember'
                  )}
                >
                  {link.highlight && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle animate-pulse-glow" />
                  )}
                  {link.name}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Magnetic>
              <QuoteForm
                trigger={
                  <button className="btn-ember text-sm">
                    Get a Quote
                    <ArrowUpRight size={16} />
                  </button>
                }
              />
            </Magnetic>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl transition-all duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex-1 overflow-y-auto px-6 pt-28 pb-10">
          <div className="flex flex-col gap-1">
            {NAVIGATION_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl font-semibold transition-all',
                  pathname === link.href ? 'text-ember' : 'text-white',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
                style={{ transitionDelay: `${120 + i * 60}ms` }}
              >
                {link.name}
                <ArrowUpRight className="text-white/30" size={22} />
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <QuoteForm
              trigger={<button className="btn-ember w-full text-base">Get a Free Quote</button>}
            />
          </div>
        </div>
      </div>
    </>
  );
}

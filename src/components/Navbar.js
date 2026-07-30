'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { BrandLogo } from './BrandLogo';
import QuoteForm from './QuoteForm';
import { Magnetic } from './anim/Magnetic';

/** A nav item is "active" for its own page and, for a group, any child page. */
function isActive(link, pathname) {
  if (pathname === link.href) return true;
  return Boolean(link.children?.some((child) => pathname === child.href));
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();
  const closeTimer = useRef(null);

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

  // Any navigation closes whatever was open.
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // A short grace period so the pointer can cross the gap to the panel.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);

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
              const active = isActive(link, pathname);
              const hasChildren = Boolean(link.children?.length);
              const expanded = openMenu === link.href;

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={hasChildren ? () => { cancelClose(); setOpenMenu(link.href); } : undefined}
                  onMouseLeave={hasChildren ? scheduleClose : undefined}
                >
                  <Link
                    href={link.href}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                    aria-expanded={hasChildren ? expanded : undefined}
                    onFocus={hasChildren ? () => setOpenMenu(link.href) : undefined}
                    className={cn(
                      'relative flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors',
                      active ? 'text-white' : 'text-white/60 hover:text-white',
                      link.highlight && !active && 'text-ember/90 hover:text-ember'
                    )}
                  >
                    {link.highlight && (
                      <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle animate-pulse-glow" />
                    )}
                    {link.name}
                    {hasChildren && (
                      <ChevronDown
                        size={13}
                        className={cn('transition-transform duration-200', expanded && 'rotate-180')}
                      />
                    )}
                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
                    )}
                  </Link>

                  {hasChildren && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition-all duration-200',
                        expanded
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none -translate-y-1 opacity-0'
                      )}
                    >
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/95 p-2 shadow-2xl backdrop-blur-xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenMenu(null)}
                            className={cn(
                              'block rounded-xl px-4 py-3 transition-colors',
                              pathname === child.href
                                ? 'bg-ember/10 text-white'
                                : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                            )}
                          >
                            <span className="block text-sm font-medium">{child.name}</span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs text-white/45">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              <div
                key={link.href}
                className={cn(
                  'border-b border-white/10 transition-all',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
                style={{ transitionDelay: `${120 + i * 60}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between py-5 font-display text-3xl font-semibold',
                    pathname === link.href ? 'text-ember' : 'text-white'
                  )}
                >
                  {link.name}
                  <ArrowUpRight className="text-white/30" size={22} />
                </Link>

                {/* Sub-pages sit inline on mobile — a nested tap target on a
                    phone is a reliable way to lose people. */}
                {link.children?.length > 0 && (
                  <div className="-mt-1 space-y-1 pb-5 pl-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-2 py-2 text-base',
                          pathname === child.href ? 'text-ember' : 'text-white/55'
                        )}
                      >
                        <span className="h-px w-4 bg-white/20" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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

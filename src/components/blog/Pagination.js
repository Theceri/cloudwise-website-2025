import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Page-number pagination. `basePath` is e.g. "/blog"; pages are linked as
 * "/blog?page=2".
 */
export function Pagination({ currentPage, totalPages, basePath = '/blog' }) {
  if (totalPages <= 1) return null;

  const href = (p) => (p === 1 ? basePath : `${basePath}?page=${p}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const link = 'flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors';
  const inactive = 'border-white/15 text-white/60 hover:border-white/40 hover:text-white';
  const active = 'border-ember bg-ember text-white';
  const disabled = 'pointer-events-none border-white/5 text-white/20';

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      <Link
        href={href(Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        className={cn(link, currentPage === 1 ? disabled : inactive)}
      >
        <ArrowLeft size={16} />
      </Link>
      {pages.map((p) => (
        <Link key={p} href={href(p)} className={cn(link, p === currentPage ? active : inactive)}>
          {p}
        </Link>
      ))}
      <Link
        href={href(Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        className={cn(link, currentPage === totalPages ? disabled : inactive)}
      >
        <ArrowRight size={16} />
      </Link>
    </nav>
  );
}

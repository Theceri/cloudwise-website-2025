import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Category filter bar for the blog. Renders an "All" link plus one pill per
 * category. `activeSlug` highlights the current category (null = All).
 */
export function CategoryPills({ categories = [], activeSlug = null }) {
  const base =
    'rounded-full border px-5 py-2 text-sm transition-all';
  const inactive =
    'border-white/15 text-white/60 hover:border-white/40 hover:text-white';
  const active = 'border-ember bg-ember text-white';

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/blog" className={cn(base, activeSlug === null ? active : inactive)}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          className={cn(base, activeSlug === c.slug ? active : inactive)}
        >
          {c.title}
          {typeof c.count === 'number' && (
            <span className="ml-1.5 text-xs opacity-60">{c.count}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white shadow-sm placeholder:text-white/35 focus-visible:border-ember/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/30 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };

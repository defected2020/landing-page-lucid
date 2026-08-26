import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 text-[0.8125rem] font-medium transition-colors duration-fast ease-smooth backdrop-blur-sm',
  {
    variants: {
      variant: {
        default:
          'border-border bg-hover-overlay text-text-muted [&>svg]:text-accent [&>svg]:h-3.5 [&>svg]:w-3.5',
        accent:
          'border-[color:var(--highlight-border)] bg-highlight text-accent',
        onImage:
          'border-white/20 bg-white/10 text-white/80 [&>svg]:text-white/90 [&>svg]:h-3.5 [&>svg]:w-3.5',
        outline: 'border-border text-text-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

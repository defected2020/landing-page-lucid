import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold transition-all duration-medium ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px]',
        outline:
          'border border-border bg-transparent text-text-muted hover:border-border-hover hover:text-text hover:bg-hover-overlay',
        ghost: 'text-text-muted hover:text-text hover:bg-hover-overlay',
        secondary:
          'bg-bg-elevated text-text border border-border hover:border-border-hover',
        link: 'text-accent underline-offset-4 hover:underline',
        cta: 'bg-cta-gradient-simple text-white hover:shadow-glow hover:-translate-y-[1px]',
      },
      size: {
        default: 'h-11 px-6 text-[0.9375rem] rounded-pill',
        sm: 'h-9 px-4 text-sm rounded-pill',
        lg: 'h-12 px-8 text-base rounded-pill',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

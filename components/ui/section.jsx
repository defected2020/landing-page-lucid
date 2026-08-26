import * as React from 'react';
import { cn } from '../../lib/utils';

const Section = React.forwardRef(
  ({ className, bleed = false, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('py-section', bleed && 'overflow-hidden', className)}
      {...props}
    >
      {children}
    </section>
  )
);
Section.displayName = 'Section';

export { Section };

import * as React from 'react';
import { cn } from '../../lib/utils';

const Container = React.forwardRef(({ className, as: Comp = 'div', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn('mx-auto w-full max-w-container px-container', className)}
    {...props}
  />
));
Container.displayName = 'Container';

export { Container };

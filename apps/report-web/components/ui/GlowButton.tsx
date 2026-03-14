import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const glowButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40',
        secondary:
          'border border-white/30 bg-white/10 text-foreground shadow-lg shadow-black/5 backdrop-blur-md hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/20 hover:shadow-xl hover:shadow-primary/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10',
      },
      size: {
        default: 'h-11',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof glowButtonVariants> & {
    asChild?: boolean;
  };

export function GlowButton({ className, variant, size, asChild = false, ...props }: GlowButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(glowButtonVariants({ variant, size, className }))} {...props} />;
}

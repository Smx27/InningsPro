import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const glowButtonVariants = cva(
  'transition-smooth inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-elevated-card hover:-translate-y-0.5 hover:shadow-glow-primary hover:ring-1 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary/70',
        secondary:
          'surface-glass border text-foreground shadow-elevated-card hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-glow-soft hover:ring-1 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary/65 dark:bg-white/5',
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

export function GlowButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: GlowButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(glowButtonVariants({ variant, size, className }))} {...props} />;
}

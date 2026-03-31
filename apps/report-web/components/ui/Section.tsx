import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const sectionSpacingVariants = cva('w-full', {
  variants: {
    spacing: {
      default: 'py-12 md:py-20 lg:py-24',
      compact: 'py-8 md:py-12',
      hero: 'py-24 md:py-32 lg:py-40',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionSpacingVariants> & {
    containerClassName?: string;
  };

export function Section({
  children,
  className,
  containerClassName,
  spacing,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionSpacingVariants({ spacing }), className)} {...props}>
      <div className={cn('container mx-auto max-w-7xl px-4 md:px-6', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

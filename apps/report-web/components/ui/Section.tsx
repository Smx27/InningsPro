import { cn } from '../../lib/utils';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
};

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn('w-full py-12 md:py-20 lg:py-24', className)}>
      <div className={cn('container mx-auto max-w-7xl px-4 md:px-6', containerClassName)}>{children}</div>
    </section>
  );
}

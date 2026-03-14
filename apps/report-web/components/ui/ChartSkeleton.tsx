import { cn } from '../../lib/utils';

interface ChartSkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm animate-pulse',
        className,
      )}
    >
      <div className="mb-4 h-4 w-40 rounded bg-muted/60" />
      <div className="h-[calc(100%-2rem)] w-full rounded-md bg-muted/50" />
    </div>
  );
}

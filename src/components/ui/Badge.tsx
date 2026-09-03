import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  tone?: 'accent' | 'dark' | 'success' | 'muted';
  className?: string;
}

export function Badge({ children, tone = 'accent', className }: BadgeProps) {
  const tones: Record<string, string> = {
    accent: 'bg-accent/10 text-accent',
    dark: 'bg-ink text-white',
    success: 'bg-emerald-100 text-emerald-700',
    muted: 'bg-black/5 text-ink-soft',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

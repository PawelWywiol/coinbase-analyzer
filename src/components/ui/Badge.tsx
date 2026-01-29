'use client';

import { BADGE_STYLES } from '@/lib/config';

type BadgeVariant = 'signal' | 'trend' | 'risk' | 'sentiment';

interface BadgeProps {
  variant: BadgeVariant;
  value: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({ variant, value, size = 'md' }: BadgeProps) => {
  const styles = BADGE_STYLES[variant] as Record<string, string>;
  const colorClass = styles[value] ?? 'badge-neutral';
  const sizeClass = size === 'lg' ? 'badge-lg' : size === 'sm' ? 'badge-sm' : '';

  if (variant === 'trend') {
    return <span className={colorClass}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>;
  }

  return <span className={`badge ${colorClass} ${sizeClass}`}>{value.toUpperCase()}</span>;
};

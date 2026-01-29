'use client';

import { memo } from 'react';
import { Card } from '@/components/ui';

interface MovingAveragesCardProps {
  averages: Record<string, number | undefined>;
}

export const MovingAveragesCard = memo(function MovingAveragesCard({
  averages,
}: MovingAveragesCardProps) {
  const entries = Object.entries(averages).filter(([, v]) => v !== undefined);

  if (entries.length === 0) return null;

  return (
    <Card>
      <p className="text-sm text-base-content/60 mb-2">Moving Averages</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {entries.map(([k, v]) => (
          <div key={k}>
            <span className="text-base-content/50">{k.toUpperCase()}:</span>{' '}
            <span>${v?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
});

'use client';

import { memo } from 'react';
import { Card } from '@/components/ui';

interface VolatilityCardProps {
  volatility: number;
}

export const VolatilityCard = memo(function VolatilityCard({ volatility }: VolatilityCardProps) {
  return (
    <Card>
      <p className="text-sm text-base-content/60">Volatility</p>
      <p className="text-lg font-semibold">{volatility.toFixed(1)}%</p>
    </Card>
  );
});

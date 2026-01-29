'use client';

import { memo } from 'react';
import { Badge, Card } from '@/components/ui';

interface PriceSignalCardProps {
  price: number;
  changePercent: number;
  action: 'buy' | 'sell' | 'hold';
  reasoning: string;
  confidence: number;
}

export const PriceSignalCard = memo(function PriceSignalCard({
  price,
  changePercent,
  action,
  reasoning,
  confidence,
}: PriceSignalCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">${price.toLocaleString()}</p>
          <p className={changePercent >= 0 ? 'text-success' : 'text-error'}>
            {changePercent >= 0 ? '+' : ''}
            {changePercent.toFixed(2)}%
          </p>
        </div>
        <Badge variant="signal" value={action} size="lg" />
      </div>
      <p className="mt-2 text-sm text-base-content/70">{reasoning}</p>
      <p className="text-xs text-base-content/50 mt-1">Confidence: {confidence}/10</p>
    </Card>
  );
});

'use client';

import { memo } from 'react';
import { Card } from '@/components/ui';
import type { PotentialProfit } from '@/lib/types';

interface ProfitPotentialCardProps {
  potentialProfit: PotentialProfit;
  weeklyTarget: number;
}

export const ProfitPotentialCard = memo(function ProfitPotentialCard({
  potentialProfit,
  weeklyTarget,
}: ProfitPotentialCardProps) {
  return (
    <Card>
      <p className="text-sm text-base-content/60 mb-2">Profit Potential</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-base-content/60">Weekly Target</span>
          <span className="font-semibold text-primary">${weeklyTarget}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Expected Daily</span>
          <span>{potentialProfit.daily}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Expected Weekly</span>
          <span className="text-success">{potentialProfit.weekly}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Risk/Drawdown</span>
          <span className="text-warning">{potentialProfit.risk}</span>
        </div>
      </div>
    </Card>
  );
});

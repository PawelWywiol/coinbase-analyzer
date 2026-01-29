'use client';

import { memo } from 'react';
import { Card } from '@/components/ui';
import type { Timeframe, TradingStrategy } from '@/lib/types';

interface StrategyCardProps {
  strategy: TradingStrategy;
  bestTimeframe: Timeframe;
}

export const StrategyCard = memo(function StrategyCard({
  strategy,
  bestTimeframe,
}: StrategyCardProps) {
  return (
    <Card>
      <p className="text-sm text-base-content/60 mb-2">Trading Strategy</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-base-content/60">Best Timeframe</span>
          <span className="font-semibold">{bestTimeframe}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Position Size</span>
          <span className="font-semibold">{strategy.recommendedPosition}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Entry</span>
          <span className="font-mono">${strategy.entryPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Stop Loss</span>
          <span className="font-mono text-error">${strategy.stopLoss.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/60">Take Profit</span>
          <span className="font-mono text-success">${strategy.takeProfit.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-xs text-base-content/50 mt-2 border-t pt-2">{strategy.reasoning}</p>
    </Card>
  );
});

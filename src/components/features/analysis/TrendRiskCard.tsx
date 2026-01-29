'use client';

import { memo } from 'react';
import { Badge, Card } from '@/components/ui';

interface TrendRiskCardProps {
  trend: 'bullish' | 'bearish' | 'sideways';
  strength: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
}

export const TrendRiskCard = memo(function TrendRiskCard({
  trend,
  strength,
  riskLevel,
  riskFactors,
}: TrendRiskCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <p className="text-sm text-base-content/60">Trend</p>
        <p className="text-lg font-semibold">
          <Badge variant="trend" value={trend} />
        </p>
        <p className="text-xs text-base-content/50">Strength: {strength}/10</p>
      </Card>
      <Card>
        <p className="text-sm text-base-content/60">Risk</p>
        <Badge variant="risk" value={riskLevel} />
        <ul className="text-xs text-base-content/50 mt-1">
          {riskFactors.slice(0, 2).map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
});

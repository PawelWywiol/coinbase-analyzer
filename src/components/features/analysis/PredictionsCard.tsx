'use client';

import { memo } from 'react';
import { Card } from '@/components/ui';

interface PredictionsCardProps {
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
}

export const PredictionsCard = memo(function PredictionsCard({
  shortTerm,
  mediumTerm,
  longTerm,
}: PredictionsCardProps) {
  return (
    <Card>
      <p className="text-sm text-base-content/60 mb-2">Predictions</p>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-base-content/50">Short-term:</span> {shortTerm}
        </p>
        <p>
          <span className="text-base-content/50">Medium-term:</span> {mediumTerm}
        </p>
        <p>
          <span className="text-base-content/50">Long-term:</span> {longTerm}
        </p>
      </div>
    </Card>
  );
});

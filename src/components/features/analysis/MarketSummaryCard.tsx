'use client';

import { memo } from 'react';
import { Badge, Card } from '@/components/ui';
import type { NewsImpact } from '@/lib/types';

interface MarketSummaryCardProps {
  marketSummary: string;
  newsImpact: NewsImpact;
}

export const MarketSummaryCard = memo(function MarketSummaryCard({
  marketSummary,
  newsImpact,
}: MarketSummaryCardProps) {
  return (
    <Card>
      <p className="text-sm text-base-content/60 mb-2">Market Summary</p>
      <p className="text-sm mb-3">{marketSummary}</p>

      <div className="border-t pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-base-content/60">News Sentiment:</span>
          <Badge variant="sentiment" value={newsImpact.sentiment} />
        </div>
        {newsImpact.keyEvents.length > 0 && (
          <ul className="text-xs text-base-content/50">
            {newsImpact.keyEvents.slice(0, 3).map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
});

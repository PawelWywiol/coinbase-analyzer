'use client';

import type { TechnicalMetrics } from '@/lib/analysis';
import type { Analysis } from '@/lib/types';
import {
  MovingAveragesCard,
  PredictionsCard,
  PriceSignalCard,
  TrendRiskCard,
  VolatilityCard,
} from './features/analysis';
import { Card, LoadingSpinner } from './ui';

interface Props {
  analysis: Analysis | null;
  metrics: TechnicalMetrics | null;
  loading: boolean;
  error: string | null;
}

export const AnalysisPanel = ({ analysis, metrics, loading, error }: Props) => {
  if (loading) {
    return <LoadingSpinner text="Analyzing with Claude..." />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!analysis || !metrics) {
    return (
      <Card className="p-6">
        <p className="text-base-content/60">Select a crypto and click Analyze to get insights.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PriceSignalCard
        price={metrics.currentPrice}
        changePercent={metrics.priceChangePercent}
        action={analysis.signals.action}
        reasoning={analysis.signals.reasoning}
        confidence={analysis.signals.confidence}
      />

      <TrendRiskCard
        trend={analysis.trend}
        strength={analysis.strength}
        riskLevel={analysis.riskAssessment.level}
        riskFactors={analysis.riskAssessment.factors}
      />

      <MovingAveragesCard averages={analysis.movingAverages} />

      <PredictionsCard
        shortTerm={analysis.prediction.shortTerm}
        mediumTerm={analysis.prediction.mediumTerm}
        longTerm={analysis.prediction.longTerm}
      />

      <VolatilityCard volatility={analysis.volatility} />
    </div>
  );
};

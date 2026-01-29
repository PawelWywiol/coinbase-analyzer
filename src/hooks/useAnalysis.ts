'use client';

import { useCallback, useState } from 'react';
import type { TechnicalMetrics } from '@/lib/analysis';
import type { Analysis, Candle, CandleData, Crypto, Timeframe } from '@/lib/types';

type MetricsPerTimeframe = Record<Timeframe, TechnicalMetrics>;

interface UseAnalysisState {
  crypto: Crypto;
  timeframe: Timeframe;
  weeklyProfitGoal: number;
  data: CandleData | null;
  analysis: Analysis | null;
  metricsPerTimeframe: MetricsPerTimeframe | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
}

interface UseAnalysisActions {
  setCrypto: (crypto: Crypto) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setWeeklyProfitGoal: (goal: number) => void;
  fetchData: () => Promise<void>;
  runAnalysis: () => Promise<void>;
  currentCandles: Candle[];
}

export const useAnalysis = (): UseAnalysisState & UseAnalysisActions => {
  const [crypto, setCrypto] = useState<Crypto>('BTC');
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');
  const [weeklyProfitGoal, setWeeklyProfitGoal] = useState(1000);
  const [data, setData] = useState<CandleData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [metricsPerTimeframe, setMetricsPerTimeframe] = useState<MetricsPerTimeframe | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candles/${crypto}`);
      if (!res.ok) throw new Error('Failed to fetch candles');
      const json = await res.json();
      setData({ crypto, timeframes: json.timeframes });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [crypto]);

  const runAnalysis = useCallback(async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crypto, weeklyProfitGoal }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const json = await res.json();
      setAnalysis(json.analysis);
      setMetricsPerTimeframe(json.metricsPerTimeframe);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [crypto, weeklyProfitGoal]);

  const currentCandles: Candle[] = data?.timeframes[timeframe] || [];

  return {
    crypto,
    timeframe,
    weeklyProfitGoal,
    data,
    analysis,
    metricsPerTimeframe,
    loading,
    analyzing,
    error,
    setCrypto,
    setTimeframe,
    setWeeklyProfitGoal,
    fetchData,
    runAnalysis,
    currentCandles,
  };
};

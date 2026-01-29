'use client';

import { useCallback, useState } from 'react';
import type { TechnicalMetrics } from '@/lib/analysis';
import type { Analysis, Candle, CandleData, Crypto, Timeframe } from '@/lib/types';

interface UseAnalysisState {
  crypto: Crypto;
  timeframe: Timeframe;
  data: CandleData | null;
  analysis: Analysis | null;
  metrics: TechnicalMetrics | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
}

interface UseAnalysisActions {
  setCrypto: (crypto: Crypto) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  fetchData: () => Promise<void>;
  runAnalysis: () => Promise<void>;
  currentCandles: Candle[];
}

export const useAnalysis = (): UseAnalysisState & UseAnalysisActions => {
  const [crypto, setCrypto] = useState<Crypto>('BTC');
  const [timeframe, setTimeframe] = useState<Timeframe>('1d');
  const [data, setData] = useState<CandleData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [metrics, setMetrics] = useState<TechnicalMetrics | null>(null);
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
    if (!data) return;
    setAnalyzing(true);
    setError(null);
    try {
      const candles = data.timeframes[timeframe];
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crypto, timeframe, candles }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const json = await res.json();
      setAnalysis(json.analysis);
      setMetrics(json.metrics);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [crypto, timeframe, data]);

  const currentCandles: Candle[] = data?.timeframes[timeframe] || [];

  return {
    crypto,
    timeframe,
    data,
    analysis,
    metrics,
    loading,
    analyzing,
    error,
    setCrypto,
    setTimeframe,
    fetchData,
    runAnalysis,
    currentCandles,
  };
};

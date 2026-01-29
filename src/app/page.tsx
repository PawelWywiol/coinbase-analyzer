'use client';

import { AnalysisPanel } from '@/components/AnalysisPanel';
import { ChartPanel } from '@/components/ChartPanel';
import { CryptoSelector } from '@/components/CryptoSelector';
import { TimeframeSelector } from '@/components/TimeframeSelector';
import { Card } from '@/components/ui';
import { useAnalysis } from '@/hooks';

export default function Home() {
  const {
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
  } = useAnalysis();

  const currentMetrics = metricsPerTimeframe?.[timeframe] ?? null;

  return (
    <main className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Coinbase Analyzer</h1>
        <p className="text-base-content/60">AI-powered crypto insights</p>
      </header>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <CryptoSelector selected={crypto} onSelect={setCrypto} disabled={loading || analyzing} />

        <div className="form-control">
          <label className="label py-0" htmlFor="profit-goal">
            <span className="label-text text-xs">Weekly Profit Goal ($)</span>
          </label>
          <input
            id="profit-goal"
            type="number"
            className="input input-bordered input-sm w-32"
            value={weeklyProfitGoal}
            onChange={(e) => setWeeklyProfitGoal(Number(e.target.value) || 1000)}
            min={1}
            disabled={analyzing}
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={fetchData} disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : 'Fetch Data'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={runAnalysis}
          disabled={analyzing}
        >
          {analyzing ? <span className="loading loading-spinner loading-sm" /> : 'Analyze'}
        </button>
      </div>

      {data && (
        <div className="mb-4">
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentCandles.length > 0 ? (
            <Card>
              <ChartPanel candles={currentCandles} />
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-base-content/60">
                Select a crypto and click "Fetch Data" to view charts
              </p>
            </Card>
          )}
        </div>
        <div>
          <AnalysisPanel
            analysis={analysis}
            metrics={currentMetrics}
            loading={analyzing}
            error={null}
          />
        </div>
      </div>
    </main>
  );
}

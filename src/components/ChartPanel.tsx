'use client';

import {
  type CandlestickData,
  CandlestickSeries,
  ColorType,
  createChart,
  type HistogramData,
  HistogramSeries,
  type IChartApi,
  type Time,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { CHART } from '@/lib/constants';
import type { Candle } from '@/lib/types';

interface Props {
  candles: Candle[];
}

export const ChartPanel = ({ candles }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;

    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch {
        // Already disposed
      }
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: CHART.COLORS.TEXT,
      },
      grid: {
        vertLines: { color: CHART.COLORS.GRID },
        horzLines: { color: CHART.COLORS.GRID },
      },
      width: containerRef.current.clientWidth,
      height: CHART.HEIGHT,
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: CHART.COLORS.UP,
      downColor: CHART.COLORS.DOWN,
      borderVisible: false,
      wickUpColor: CHART.COLORS.UP,
      wickDownColor: CHART.COLORS.DOWN,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: CHART.COLORS.VOLUME,
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    chart.priceScale('').applyOptions({
      scaleMargins: CHART.VOLUME_SCALE_MARGINS,
    });

    const candleData: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.timestamp as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumeData: HistogramData<Time>[] = candles.map((c) => ({
      time: c.timestamp as Time,
      value: c.volume,
      color: c.close >= c.open ? CHART.COLORS.UP_TRANSPARENT : CHART.COLORS.DOWN_TRANSPARENT,
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        chart.remove();
      } catch {
        // Already disposed
      }
      chartRef.current = null;
    };
  }, [candles]);

  return <div ref={containerRef} className="w-full" />;
};

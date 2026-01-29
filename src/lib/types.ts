export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Coinbase API response format: [timestamp, low, high, open, close, volume]
export type CoinbaseCandle = [
  timestamp: number,
  low: number,
  high: number,
  open: number,
  close: number,
  volume: number,
];

export type Crypto = 'BTC' | 'ETH' | 'LINK' | 'LTC' | 'DOT';

export type Timeframe = '1d' | '7d' | '1m' | '3m' | '6m' | '1y' | '5y';

interface TimeframeConfig {
  label: string;
  granularity: number;
  duration: number;
}

// Coinbase limits: 300 candles max, valid granularities: 60, 300, 900, 3600, 21600, 86400
export const TIMEFRAMES: Record<Timeframe, TimeframeConfig> = {
  '1d': { label: '1 Day', granularity: 300, duration: 86400 },
  '7d': { label: '7 Days', granularity: 3600, duration: 604800 },
  '1m': { label: '1 Month', granularity: 21600, duration: 2592000 },
  '3m': { label: '3 Months', granularity: 86400, duration: 7776000 },
  '6m': { label: '6 Months', granularity: 86400, duration: 15552000 },
  '1y': { label: '1 Year', granularity: 86400, duration: 25920000 },
  '5y': { label: '5 Years', granularity: 86400, duration: 25920000 },
};

export const CRYPTOS: Record<Crypto, string> = {
  BTC: 'BTC-USD',
  ETH: 'ETH-USD',
  LINK: 'LINK-USD',
  LTC: 'LTC-USD',
  DOT: 'DOT-USD',
};

export interface Analysis {
  trend: 'bullish' | 'bearish' | 'sideways';
  strength: number;
  supportLevels: number[];
  resistanceLevels: number[];
  movingAverages: {
    ma7?: number;
    ma14?: number;
    ma30?: number;
    ma90?: number;
    ma180?: number;
    ma365?: number;
  };
  volatility: number;
  signals: {
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasoning: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  prediction: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  bestTimeframe: Timeframe;
  strategy: TradingStrategy;
  potentialProfit: PotentialProfit;
  marketSummary: string;
  newsImpact: NewsImpact;
}

export interface CandleData {
  crypto: Crypto;
  timeframes: Record<Timeframe, Candle[]>;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface TradingStrategy {
  weeklyTarget: number;
  recommendedPosition: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
}

export interface PotentialProfit {
  daily: string;
  weekly: string;
  risk: string;
}

export interface NewsImpact {
  sentiment: 'positive' | 'negative' | 'neutral';
  keyEvents: string[];
}

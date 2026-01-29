import type { Candle, CoinbaseCandle } from '../types';

const transformCoinbaseCandle = (raw: CoinbaseCandle): Candle => ({
  timestamp: raw[0],
  low: raw[1],
  high: raw[2],
  open: raw[3],
  close: raw[4],
  volume: raw[5],
});

export const transformCoinbaseCandles = (raw: CoinbaseCandle[]): Candle[] =>
  raw.map(transformCoinbaseCandle).sort((a, b) => a.timestamp - b.timestamp);

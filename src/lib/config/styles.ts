export const BADGE_STYLES = {
  signal: {
    buy: 'badge-success',
    sell: 'badge-error',
    hold: 'badge-warning',
  },
  trend: {
    bullish: 'text-success',
    bearish: 'text-error',
    sideways: 'text-warning',
  },
  risk: {
    low: 'badge-success',
    medium: 'badge-warning',
    high: 'badge-error',
  },
  sentiment: {
    positive: 'badge-success',
    negative: 'badge-error',
    neutral: 'badge-neutral',
  },
} as const;

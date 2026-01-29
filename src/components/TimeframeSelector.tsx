'use client';

import { TIMEFRAMES, type Timeframe } from '@/lib/types';

interface Props {
  selected: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}

export const TimeframeSelector = ({ selected, onSelect }: Props) => (
  <div className="tabs tabs-boxed">
    {(Object.keys(TIMEFRAMES) as Timeframe[]).map((tf) => (
      <button
        key={tf}
        type="button"
        className={`tab ${selected === tf ? 'tab-active' : ''}`}
        onClick={() => onSelect(tf)}
      >
        {TIMEFRAMES[tf].label}
      </button>
    ))}
  </div>
);

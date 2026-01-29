'use client';

import { CRYPTOS, type Crypto } from '@/lib/types';

interface Props {
  selected: Crypto;
  onSelect: (crypto: Crypto) => void;
  disabled?: boolean;
}

export const CryptoSelector = ({ selected, onSelect, disabled }: Props) => (
  <select
    className="select select-bordered w-full max-w-xs"
    value={selected}
    onChange={(e) => onSelect(e.target.value as Crypto)}
    disabled={disabled}
  >
    {Object.keys(CRYPTOS).map((crypto) => (
      <option key={crypto} value={crypto}>
        {crypto}
      </option>
    ))}
  </select>
);

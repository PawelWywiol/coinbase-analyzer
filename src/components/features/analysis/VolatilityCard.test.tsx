import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VolatilityCard } from './VolatilityCard';

describe('VolatilityCard', () => {
  it('should render volatility percentage', () => {
    render(<VolatilityCard volatility={23.456} />);

    expect(screen.getByText('Volatility')).toBeInTheDocument();
    expect(screen.getByText('23.5%')).toBeInTheDocument();
  });

  it('should handle zero volatility', () => {
    render(<VolatilityCard volatility={0} />);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });
});

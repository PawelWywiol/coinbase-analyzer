import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriceSignalCard } from './PriceSignalCard';

describe('PriceSignalCard', () => {
  it('should render all fields correctly', () => {
    render(
      <PriceSignalCard
        price={45000}
        changePercent={2.5}
        action="buy"
        reasoning="Strong momentum"
        confidence={8}
      />,
    );

    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
    expect(screen.getByText('BUY')).toBeInTheDocument();
    expect(screen.getByText('Strong momentum')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 8/10')).toBeInTheDocument();
  });

  it('should show negative change with correct styling', () => {
    render(
      <PriceSignalCard
        price={40000}
        changePercent={-3.25}
        action="sell"
        reasoning="Weak trend"
        confidence={6}
      />,
    );

    const changeEl = screen.getByText('-3.25%');
    expect(changeEl).toHaveClass('text-error');
  });

  it('should show positive change with correct styling', () => {
    render(
      <PriceSignalCard
        price={40000}
        changePercent={1.5}
        action="hold"
        reasoning="Neutral"
        confidence={5}
      />,
    );

    const changeEl = screen.getByText('+1.50%');
    expect(changeEl).toHaveClass('text-success');
  });
});

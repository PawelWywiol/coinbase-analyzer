import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrendRiskCard } from './TrendRiskCard';

describe('TrendRiskCard', () => {
  it('should render trend and risk data correctly', () => {
    render(
      <TrendRiskCard
        trend="bullish"
        strength={7}
        riskLevel="medium"
        riskFactors={['Market volatility', 'Low volume', 'External factors']}
      />,
    );

    expect(screen.getByText('Trend')).toBeInTheDocument();
    expect(screen.getByText('Bullish')).toBeInTheDocument();
    expect(screen.getByText('Strength: 7/10')).toBeInTheDocument();
    expect(screen.getByText('Risk')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText(/Market volatility/)).toBeInTheDocument();
    expect(screen.getByText(/Low volume/)).toBeInTheDocument();
  });

  it('should only show first 2 risk factors', () => {
    render(
      <TrendRiskCard
        trend="bearish"
        strength={4}
        riskLevel="high"
        riskFactors={['Factor 1', 'Factor 2', 'Factor 3']}
      />,
    );

    expect(screen.getByText(/Factor 1/)).toBeInTheDocument();
    expect(screen.getByText(/Factor 2/)).toBeInTheDocument();
    expect(screen.queryByText(/Factor 3/)).not.toBeInTheDocument();
  });
});

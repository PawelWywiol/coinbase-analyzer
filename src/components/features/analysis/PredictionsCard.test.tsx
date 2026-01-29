import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PredictionsCard } from './PredictionsCard';

describe('PredictionsCard', () => {
  it('should render all predictions', () => {
    render(
      <PredictionsCard
        shortTerm="Likely to rise 5%"
        mediumTerm="Consolidation expected"
        longTerm="Bullish outlook"
      />,
    );

    expect(screen.getByText('Predictions')).toBeInTheDocument();
    expect(screen.getByText('Short-term:')).toBeInTheDocument();
    expect(screen.getByText('Likely to rise 5%')).toBeInTheDocument();
    expect(screen.getByText('Medium-term:')).toBeInTheDocument();
    expect(screen.getByText('Consolidation expected')).toBeInTheDocument();
    expect(screen.getByText('Long-term:')).toBeInTheDocument();
    expect(screen.getByText('Bullish outlook')).toBeInTheDocument();
  });
});

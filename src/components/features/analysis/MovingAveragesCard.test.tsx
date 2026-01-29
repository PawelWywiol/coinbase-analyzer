import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MovingAveragesCard } from './MovingAveragesCard';

describe('MovingAveragesCard', () => {
  it('should render available MAs and filter undefined', () => {
    render(
      <MovingAveragesCard
        averages={{
          ma7: 45000,
          ma14: 44500,
          ma30: undefined,
          ma90: 43000,
        }}
      />,
    );

    expect(screen.getByText('Moving Averages')).toBeInTheDocument();
    expect(screen.getByText('MA7:')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('MA14:')).toBeInTheDocument();
    expect(screen.getByText('MA90:')).toBeInTheDocument();
    expect(screen.queryByText('MA30:')).not.toBeInTheDocument();
  });

  it('should return null when all averages undefined', () => {
    const { container } = render(
      <MovingAveragesCard
        averages={{
          ma7: undefined,
          ma14: undefined,
        }}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});

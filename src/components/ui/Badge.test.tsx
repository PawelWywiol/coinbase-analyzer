import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('should render signal variants with correct colors and uppercase', () => {
    const { rerender } = render(<Badge variant="signal" value="buy" />);
    expect(screen.getByText('BUY')).toHaveClass('badge-success');

    rerender(<Badge variant="signal" value="sell" />);
    expect(screen.getByText('SELL')).toHaveClass('badge-error');

    rerender(<Badge variant="signal" value="hold" />);
    expect(screen.getByText('HOLD')).toHaveClass('badge-warning');
  });

  it('should render trend variants with capitalize', () => {
    const { rerender } = render(<Badge variant="trend" value="bullish" />);
    expect(screen.getByText('Bullish')).toHaveClass('text-success');

    rerender(<Badge variant="trend" value="bearish" />);
    expect(screen.getByText('Bearish')).toHaveClass('text-error');

    rerender(<Badge variant="trend" value="sideways" />);
    expect(screen.getByText('Sideways')).toHaveClass('text-warning');
  });

  it('should render risk variants with correct colors', () => {
    const { rerender } = render(<Badge variant="risk" value="low" />);
    expect(screen.getByText('LOW')).toHaveClass('badge-success');

    rerender(<Badge variant="risk" value="medium" />);
    expect(screen.getByText('MEDIUM')).toHaveClass('badge-warning');

    rerender(<Badge variant="risk" value="high" />);
    expect(screen.getByText('HIGH')).toHaveClass('badge-error');
  });

  it('should apply size classes', () => {
    const { rerender } = render(<Badge variant="signal" value="buy" size="lg" />);
    expect(screen.getByText('BUY')).toHaveClass('badge-lg');

    rerender(<Badge variant="signal" value="buy" size="sm" />);
    expect(screen.getByText('BUY')).toHaveClass('badge-sm');
  });
});

'use client';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`card bg-base-200 p-4 ${className}`}>{children}</div>
);

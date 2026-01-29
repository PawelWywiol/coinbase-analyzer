import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coinbase Analyzer',
  description: 'Crypto analysis with AI insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-base-100">{children}</body>
    </html>
  );
}

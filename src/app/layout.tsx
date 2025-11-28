import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polyspack Enterprises - Agricultural Solutions',
  description: 'Quality agricultural products and services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

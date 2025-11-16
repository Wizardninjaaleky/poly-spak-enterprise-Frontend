import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReduxProvider from '@/components/ReduxProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Polyspack Enterprises - Seedling Bags, Electronics & Services',
  description: 'Your trusted partner for seedling bags, electronics, and professional services. Countrywide delivery across Kenya.',
  keywords: 'seedling bags, electronics, services, Kenya, delivery, Polyspack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}

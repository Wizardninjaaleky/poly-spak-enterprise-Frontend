import './globals.css';
import ReduxProvider from './ReduxProvider';

export const metadata = {
  title: 'Polyspack Enterprises - Quality Agricultural Supplies & Electronics in Kenya',
  description: 'Leading supplier of seedling bags, nursery supplies, solar lights, and electronics across Kenya. Fast nationwide delivery, competitive prices, and 24/7 customer support. Order now!',
  keywords: 'seedling bags Kenya, nursery supplies, tree planting bags, solar lights Kenya, agricultural supplies, polyspack, electronics Kenya, M-PESA payment',
  authors: [{ name: 'Polyspack Enterprises' }],
  openGraph: {
    title: 'Polyspack Enterprises - Quality Agricultural Supplies & Electronics',
    description: 'Your trusted partner for seedling bags, agricultural supplies, and electronics in Kenya. Nationwide delivery available.',
    url: 'https://polyspackenterprises.co.ke',
    siteName: 'Polyspack Enterprises',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polyspack Enterprises - Agricultural Solutions',
    description: 'Quality seedling bags, solar lights, and electronics delivered across Kenya.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="canonical" href="https://polyspackenterprises.co.ke" />
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

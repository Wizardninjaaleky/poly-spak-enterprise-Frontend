import './globals.css';

export const metadata = {
  title: 'Polyspack Enterprises - Agricultural Solutions',
  description: 'Quality agricultural products and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

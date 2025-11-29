import './globals.css';
import ReduxProvider from './ReduxProvider';

export const metadata = {
  title: 'Polyspack Enterprises - Agricultural Solutions',
  description: 'Quality agricultural products and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

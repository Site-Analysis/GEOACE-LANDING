import './globals.css';

export const metadata = {
  title: 'GeoAce — There’s more to a place.',
  description: 'A place is never just a place. GeoAce brings scattered site data into focus, for clearer decisions about the places we shape.',
};

export const viewport = { themeColor: '#f8f9f7' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

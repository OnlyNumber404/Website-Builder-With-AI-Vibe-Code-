import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexaWeb.ai - Bikin Website Toko Sendiri Cukup Pakai Bahasa Sehari-hari',
  description: 'Platform AI pembuat website toko modern untuk pemilik UMKM Indonesia usia 40-50 tahun. 100% tanpa koding, instan, terhubung ke WhatsApp.',
  keywords: ['website builder umkm', 'bikin website toko', 'ai website builder indonesia', 'nexaweb'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

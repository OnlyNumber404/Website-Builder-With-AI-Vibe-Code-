import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexaWeb.ai - Website Builder AI Modern untuk UMKM Indonesia',
  description: 'Platform AI pembuat website toko & katalog bisnis modern untuk seluruh pelaku UMKM Indonesia. Tanpa coding, dilengkapi Mode Template, Advance Designer Mode ala Canva, AI Copilot, dan integrasi WhatsApp.',
  keywords: ['website builder umkm', 'bikin website toko', 'ai website builder indonesia', 'nexaweb', 'canva website builder'],
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/images/nexaweb-app-icon.jpg',
  },
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

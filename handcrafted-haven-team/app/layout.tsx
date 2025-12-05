import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ClientProviders from '@/app/ui/ClientProviders';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),

  openGraph: {
    title: 'Acme Dashboard',
    description: 'The official Next.js Learn Dashboard built with App Router.',
    url: '/',
    siteName: 'Acme Dashboard',
    images: [
      {
        url: '/products/social_media.webp', // <-- replace with your real image path
        width: 1276,
        height: 956,
        alt: 'Acme Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Acme Dashboard',
    description: 'The official Next.js Learn Dashboard built with App Router.',
    images: ['/products/social_media.webp'], // <-- replace with your real image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

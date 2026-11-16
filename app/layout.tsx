import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#090D16' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://saanspatra.civic.in'),
  title: 'SaansPatra (सांसपत्र) – Civic Air Quality Intelligence & Policy Studio',
  description:
    'AI-driven civic intelligence platform transforming raw, chaotic air quality data into grounded, persona-prioritized municipal interventions and multi-lingual citizen advisories under official CPCB India NAQI standards.',
  keywords: [
    'Air Quality India',
    'CPCB NAQI',
    'CAAQMS Telemetry',
    'Civic Intelligence',
    'Municipal Briefings',
    'Gemini AI',
    'Delhi Smog',
    'Bhopal Clean Air',
    'GrAP Intervention Tracker',
    'Public Health Advisory',
  ],
  authors: [{ name: 'SaansPatra Civic Intelligence Initiative' }],
  creator: 'SaansPatra Team',
  icons: {
    icon: '/saanspatra-emblem.svg',
    shortcut: '/saanspatra-emblem.svg',
    apple: '/saanspatra-emblem.svg',
  },
  openGraph: {
    title: 'SaansPatra (सांसपत्र) – Civic Air Quality Intelligence Studio',
    description:
      'Deterministic telemetry cleansing, CPCB NAQI analytics, grounded Gemini policy directives, and multi-lingual citizen advisories.',
    url: 'https://saanspatra.civic.in',
    siteName: 'SaansPatra Civic Intelligence',
    images: [
      {
        url: '/og-banner.svg',
        width: 1200,
        height: 630,
        alt: 'SaansPatra - Civic Air Quality Intelligence & Policy Briefing Studio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaansPatra (सांसपत्र) – Civic Air Quality Intelligence Studio',
    description:
      'Grounded air quality policy briefs and multi-lingual citizen advisories powered by CPCB analytics and Google Gemini.',
    images: ['/og-banner.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-marigold)] selection:text-[var(--color-ink)] font-sans antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}

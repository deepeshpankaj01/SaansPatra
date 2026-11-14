import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SaansPatra – Civic Air Quality Briefing Studio',
  description:
    'AI-driven civic intelligence tool that turns raw, messy air quality monitoring tables into grounded, actionable local briefings and citizen advisories for ward officers, housing societies, schools, and citizens.',
  keywords: [
    'Air Quality',
    'AQI',
    'CPCB',
    'Civic Intelligence',
    'Gemini AI',
    'Public Health',
    'Delhi Air Quality',
    'Municipal Briefings',
  ],
  authors: [{ name: 'SaansPatra Civic Intelligence' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-marigold)] selection:text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}

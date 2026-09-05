import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedLens — Clinical Information Intelligence',
  description: 'Turn fragmented medical records into structured, reviewable, traceable, and human-verified patient records.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-primaryText antialiased">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <div id="aria-announcement-region" className="sr-only" aria-live="polite" aria-atomic="true" role="status" />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}

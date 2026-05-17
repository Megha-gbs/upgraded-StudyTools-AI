import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'StudyTools AI - Free PDF Tools & Student Utilities',
    template: '%s | StudyTools AI',
  },
  description:
    'Free online PDF tools, student calculators, and AI-powered study helpers. Merge, compress, convert PDFs. Calculate CGPA, attendance, and more.',
  keywords: [
    'PDF tools',
    'merge PDF',
    'compress PDF',
    'student tools',
    'CGPA calculator',
    'attendance calculator',
    'AI resume checker',
    'study tools',
    'free PDF converter',
    'image to PDF',
    'PDF to image',
  ],
  authors: [{ name: 'StudyTools AI' }],
  creator: 'StudyTools AI',
  publisher: 'StudyTools AI',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://studytools.ai'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'StudyTools AI',
    title: 'StudyTools AI - Free PDF Tools & Student Utilities',
    description:
      'Free online PDF tools, student calculators, and AI-powered study helpers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyTools AI - Free PDF Tools & Student Utilities',
    description:
      'Free online PDF tools, student calculators, and AI-powered study helpers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

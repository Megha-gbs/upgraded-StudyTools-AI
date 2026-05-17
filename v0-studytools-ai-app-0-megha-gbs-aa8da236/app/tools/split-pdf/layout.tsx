import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Split PDF - Extract Pages from PDF',
  description:
    'Free online PDF splitter. Extract specific pages from a PDF or split into multiple documents. No sign-up required.',
  keywords: ['split PDF', 'extract PDF pages', 'PDF splitter', 'separate PDF', 'cut PDF'],
  openGraph: {
    title: 'Split PDF - Extract Pages from PDF',
    description: 'Free online PDF splitter. Extract specific pages from your PDF.',
  },
}

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

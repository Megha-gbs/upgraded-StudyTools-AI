import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merge PDF - Combine Multiple PDFs into One',
  description:
    'Free online tool to merge multiple PDF files into a single document. Easy drag-and-drop interface with custom page ordering. No sign-up required.',
  keywords: ['merge PDF', 'combine PDF', 'PDF merger', 'join PDF files', 'free PDF tool'],
  openGraph: {
    title: 'Merge PDF - Combine Multiple PDFs into One',
    description: 'Free online tool to merge multiple PDF files into a single document.',
  },
}

export default function MergePdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

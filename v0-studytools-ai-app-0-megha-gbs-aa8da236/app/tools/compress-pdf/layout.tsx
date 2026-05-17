import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress PDF - Reduce PDF File Size',
  description:
    'Free online PDF compressor. Reduce PDF file size while maintaining quality. Choose from multiple compression levels. No sign-up required.',
  keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor', 'shrink PDF', 'optimize PDF'],
  openGraph: {
    title: 'Compress PDF - Reduce PDF File Size',
    description: 'Free online PDF compressor. Reduce file size while maintaining quality.',
  },
}

export default function CompressPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

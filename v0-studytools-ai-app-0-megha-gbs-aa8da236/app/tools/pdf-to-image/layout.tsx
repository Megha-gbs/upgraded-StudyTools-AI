import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to Image - Convert PDF Pages to Images',
  description:
    'Free online PDF to image converter. Convert PDF pages to high-quality JPG or PNG images. No sign-up required.',
  keywords: ['PDF to image', 'PDF to JPG', 'PDF to PNG', 'convert PDF to image', 'PDF converter'],
  openGraph: {
    title: 'PDF to Image - Convert PDF Pages to Images',
    description: 'Free online PDF to image converter. Convert PDF pages to JPG or PNG.',
  },
}

export default function PdfToImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

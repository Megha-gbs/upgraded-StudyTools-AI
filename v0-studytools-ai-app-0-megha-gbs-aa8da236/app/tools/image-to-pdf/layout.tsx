import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to PDF - Convert Images to PDF',
  description:
    'Free online image to PDF converter. Convert JPG, PNG, and other images to PDF. Supports multiple images with custom ordering. No sign-up required.',
  keywords: ['image to PDF', 'JPG to PDF', 'PNG to PDF', 'convert image to PDF', 'photo to PDF'],
  openGraph: {
    title: 'Image to PDF - Convert Images to PDF',
    description: 'Free online image to PDF converter. Convert JPG, PNG, and other images.',
  },
}

export default function ImageToPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

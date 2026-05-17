import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - StudyTools AI',
  description: 'Get in touch with StudyTools AI. Send us your questions, feedback, or suggestions.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Resume Checker - Get Instant Resume Feedback',
  description:
    'Free AI-powered resume checker. Get instant feedback on your resume content, formatting, and keywords. Improve your chances of landing interviews.',
  keywords: ['AI resume checker', 'resume analyzer', 'resume feedback', 'resume review', 'CV checker'],
  openGraph: {
    title: 'AI Resume Checker - Get Instant Resume Feedback',
    description: 'Free AI-powered resume checker. Get instant feedback on your resume.',
  },
}

export default function ResumeCheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

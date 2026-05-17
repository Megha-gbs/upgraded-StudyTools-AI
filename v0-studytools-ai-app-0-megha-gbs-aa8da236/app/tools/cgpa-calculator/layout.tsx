import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CGPA Calculator - Calculate Your GPA/CGPA',
  description:
    'Free CGPA/GPA calculator for students. Calculate your cumulative grade point average with support for different grading systems.',
  keywords: ['CGPA calculator', 'GPA calculator', 'grade calculator', 'college GPA', 'SGPA calculator'],
  openGraph: {
    title: 'CGPA Calculator - Calculate Your GPA/CGPA',
    description: 'Free CGPA/GPA calculator with support for different grading systems.',
  },
}

export default function CGPACalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attendance Calculator - Track Your Class Attendance',
  description:
    'Free attendance calculator for students. Calculate your attendance percentage and find out how many classes you can miss. Perfect for college students.',
  keywords: ['attendance calculator', 'attendance percentage', 'college attendance', 'class attendance tracker'],
  openGraph: {
    title: 'Attendance Calculator - Track Your Class Attendance',
    description: 'Calculate your attendance percentage and find out how many classes you can miss.',
  },
}

export default function AttendanceCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pomodoro Timer - Focus Timer for Productivity',
  description:
    'Free Pomodoro timer for students. Boost productivity with the Pomodoro technique. Customizable work and break intervals.',
  keywords: ['Pomodoro timer', 'focus timer', 'productivity timer', 'study timer', 'work timer'],
  openGraph: {
    title: 'Pomodoro Timer - Focus Timer for Productivity',
    description: 'Boost productivity with the Pomodoro technique. Customizable work and break intervals.',
  },
}

export default function PomodoroTimerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Notes Summarizer - StudyTools AI',
  description: 'Transform your study notes into clear summaries, key points, flashcards, and study questions using AI.',
  keywords: ['notes summarizer', 'AI study tool', 'flashcard generator', 'study notes', 'student tool'],
}

export default function NotesSummarizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

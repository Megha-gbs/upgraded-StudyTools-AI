export const siteConfig = {
  name: 'StudyTools AI',
  description:
    'Free online PDF tools, student calculators, and AI-powered study helpers.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://studytools.ai',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/studytoolsai',
    github: 'https://github.com/studytoolsai',
  },
}

export type ToolCategory = 'pdf' | 'student' | 'ai' | 'converter'

export interface Tool {
  id: string
  name: string
  description: string
  shortDescription: string
  href: string
  icon: string
  category: ToolCategory
  gradient: string
  featured?: boolean
}

export const tools: Tool[] = [
  // PDF Tools
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description:
      'Combine multiple PDF files into a single document. Easy drag-and-drop interface with custom page ordering.',
    shortDescription: 'Combine multiple PDFs into one',
    href: '/tools/merge-pdf',
    icon: 'Layers',
    category: 'pdf',
    gradient: 'from-blue-500 to-blue-600',
    featured: true,
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description:
      'Reduce PDF file size while maintaining quality. Choose from multiple compression levels.',
    shortDescription: 'Reduce PDF file size',
    href: '/tools/compress-pdf',
    icon: 'FileArchive',
    category: 'pdf',
    gradient: 'from-emerald-500 to-emerald-600',
    featured: true,
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description:
      'Convert JPG, PNG, and other image formats to PDF. Supports multiple images with custom ordering.',
    shortDescription: 'Convert images to PDF',
    href: '/tools/image-to-pdf',
    icon: 'ImageIcon',
    category: 'pdf',
    gradient: 'from-amber-500 to-amber-600',
    featured: true,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description:
      'Extract specific pages from a PDF or split into multiple documents.',
    shortDescription: 'Extract pages from PDF',
    href: '/tools/split-pdf',
    icon: 'Scissors',
    category: 'pdf',
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description:
      'Convert PDF pages to high-quality JPG or PNG images.',
    shortDescription: 'Convert PDF pages to images',
    href: '/tools/pdf-to-image',
    icon: 'Image',
    category: 'pdf',
    gradient: 'from-violet-500 to-violet-600',
  },
  // Student Utilities
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    description:
      'Calculate your attendance percentage and find out how many classes you can miss.',
    shortDescription: 'Track your class attendance',
    href: '/tools/attendance-calculator',
    icon: 'Calendar',
    category: 'student',
    gradient: 'from-cyan-500 to-cyan-600',
    featured: true,
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    description:
      'Calculate your CGPA/GPA with support for different grading systems.',
    shortDescription: 'Calculate your GPA/CGPA',
    href: '/tools/cgpa-calculator',
    icon: 'Calculator',
    category: 'student',
    gradient: 'from-indigo-500 to-indigo-600',
    featured: true,
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description:
      'Boost productivity with the Pomodoro technique. Customizable work and break intervals.',
    shortDescription: 'Focus timer for productivity',
    href: '/tools/pomodoro-timer',
    icon: 'Timer',
    category: 'student',
    gradient: 'from-orange-500 to-orange-600',
  },
  // AI Tools
  {
    id: 'resume-checker',
    name: 'AI Resume Checker',
    description:
      'Get instant AI-powered feedback on your resume. Improve formatting, content, and keywords.',
    shortDescription: 'AI-powered resume analysis',
    href: '/tools/resume-checker',
    icon: 'FileCheck',
    category: 'ai',
    gradient: 'from-purple-500 to-purple-600',
    featured: true,
  },
  {
    id: 'notes-summarizer',
    name: 'AI Notes Summarizer',
    description:
      'Summarize long notes and documents with AI. Perfect for studying and revision.',
    shortDescription: 'Summarize notes with AI',
    href: '/tools/notes-summarizer',
    icon: 'FileText',
    category: 'ai',
    gradient: 'from-pink-500 to-pink-600',
    featured: true,
  },
]

export const categoryLabels: Record<ToolCategory, string> = {
  pdf: 'PDF Tools',
  student: 'Student Utilities',
  ai: 'AI Tools',
  converter: 'Converters',
}

export const categoryDescriptions: Record<ToolCategory, string> = {
  pdf: 'Edit, convert, and manage your PDF files',
  student: 'Essential calculators and tools for students',
  ai: 'AI-powered tools to boost your productivity',
  converter: 'Convert between different file formats',
}

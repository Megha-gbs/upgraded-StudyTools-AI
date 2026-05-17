import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://studytools.ai'

  const tools = [
    'merge-pdf',
    'compress-pdf',
    'image-to-pdf',
    'split-pdf',
    'pdf-to-image',
    'attendance-calculator',
    'cgpa-calculator',
    'pomodoro-timer',
    'resume-checker',
    'notes-summarizer',
  ]

  const pages = [
    '',
    '/tools',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const allPages: MetadataRoute.Sitemap = [
    ...pages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  return allPages
}

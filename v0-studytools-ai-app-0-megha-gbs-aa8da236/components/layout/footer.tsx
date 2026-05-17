import Link from 'next/link'
import { FileText } from 'lucide-react'
import { tools, categoryLabels, type ToolCategory } from '@/lib/config'

const footerLinks = {
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
}

export function Footer() {
  const categories = ['pdf', 'student', 'ai'] as ToolCategory[]

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">StudyTools AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Free online PDF tools, student calculators, and AI-powered study
              helpers. Built for students, by students.
            </p>
          </div>

          {/* Tool Categories */}
          {categories.map((category) => {
            const categoryTools = tools.filter((t) => t.category === category)
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold">
                  {categoryLabels[category]}
                </h3>
                <ul className="mt-4 space-y-2">
                  {categoryTools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StudyTools AI. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

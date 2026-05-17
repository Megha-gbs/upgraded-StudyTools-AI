'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  FileText,
  Menu,
  X,
  ChevronDown,
  Layers,
  Calculator,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { tools, categoryLabels, type ToolCategory } from '@/lib/config'
import { cn } from '@/lib/utils'

const categoryIcons: Record<ToolCategory, React.ElementType> = {
  pdf: FileText,
  student: Calculator,
  ai: Sparkles,
  converter: Layers,
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = ['pdf', 'student', 'ai'] as ToolCategory[]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">StudyTools AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {categories.map((category) => {
            const Icon = categoryIcons[category]
            const categoryTools = tools.filter((t) => t.category === category)

            return (
              <DropdownMenu key={category}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    <Icon className="h-4 w-4" />
                    {categoryLabels[category]}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>
                    {categoryLabels[category]}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categoryTools.map((tool) => (
                    <DropdownMenuItem key={tool.id} asChild>
                      <Link href={tool.href} className="cursor-pointer">
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tool.shortDescription}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
          <Link href="/tools">
            <Button variant="ghost">All Tools</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {categories.map((category) => {
              const categoryTools = tools.filter((t) => t.category === category)
              return (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                    {categoryLabels[category]}
                  </div>
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm hover:bg-accent'
                      )}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )
            })}
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              View All Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

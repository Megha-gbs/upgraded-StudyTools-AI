import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Tool } from '@/lib/config'

interface ToolCardProps {
  tool: Tool
  variant?: 'default' | 'compact'
}

export function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const IconComponent =
    LucideIcons[tool.icon as keyof typeof LucideIcons] || LucideIcons.FileText

  if (variant === 'compact') {
    return (
      <Link
        href={tool.href}
        className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      >
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white',
            tool.gradient
          )}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold group-hover:text-primary">
            {tool.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {tool.shortDescription}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
    >
      {tool.featured && (
        <Badge className="absolute right-4 top-4" variant="secondary">
          Popular
        </Badge>
      )}
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform group-hover:scale-105',
          tool.gradient
        )}
      >
        <IconComponent className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {tool.description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-primary">
        Use Tool
        <LucideIcons.ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

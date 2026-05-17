'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, FileText, Calculator, Sparkles, LayoutGrid } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { ToolCard } from '@/components/tool-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { tools, categoryLabels, type ToolCategory } from '@/lib/config'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', label: 'All Tools', icon: LayoutGrid },
  { id: 'pdf', label: 'PDF Tools', icon: FileText },
  { id: 'student', label: 'Student', icon: Calculator },
  { id: 'ai', label: 'AI Tools', icon: Sparkles },
] as const

function ToolsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | ToolCategory
  >((categoryParam as ToolCategory) || 'all')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory
      const matchesSearch =
        search === '' ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              All Tools
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our collection of {tools.length} free tools
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(category.id as 'all' | ToolCategory)
                  }
                  className={cn(
                    'gap-1.5',
                    selectedCategory === category.id && 'shadow-sm'
                  )}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-lg text-muted-foreground">
                No tools found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('all')
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Category Summary */}
          {selectedCategory === 'all' && search === '' && (
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {(['pdf', 'student', 'ai'] as ToolCategory[]).map((cat) => {
                const categoryTools = tools.filter((t) => t.category === cat)
                return (
                  <div
                    key={cat}
                    className="rounded-xl border bg-card p-6 text-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {categoryLabels[cat]}
                    </h3>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {categoryTools.length}
                    </p>
                    <p className="text-sm text-muted-foreground">tools</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ToolsContent />
    </Suspense>
  )
}

import { Header, Footer } from '@/components/layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { categoryLabels, type ToolCategory } from '@/lib/config'

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  category: ToolCategory
  toolName: string
}

export function ToolLayout({
  children,
  title,
  description,
  category,
  toolName,
}: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/tools?category=${category}`}>
                  {categoryLabels[category]}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{toolName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Tool Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              {title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Tool Content */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {children}
          </div>

          {/* Ad Space Placeholder */}
          <div className="mt-8 flex items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <span className="text-sm">Advertisement Space</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  FileText,
  Calculator,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, Footer } from '@/components/layout'
import { ToolCard } from '@/components/tool-card'
import { tools, categoryLabels, type ToolCategory } from '@/lib/config'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'All processing happens in your browser. No uploads, no waiting.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your files never leave your device. Complete privacy guaranteed.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Use all tools on any device. Optimized for desktop and mobile.',
  },
]

const categoryIcons: Record<ToolCategory, React.ElementType> = {
  pdf: FileText,
  student: Calculator,
  ai: Sparkles,
  converter: FileText,
}

export default function HomePage() {
  const featuredTools = tools.filter((t) => t.featured)
  const categories = ['pdf', 'student', 'ai'] as ToolCategory[]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Free Forever. No Sign-up Required.
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Your Complete{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Student Toolkit
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl text-pretty">
                PDF tools, calculators, and AI-powered helpers designed for students.
                All free, fast, and privacy-focused.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/tools">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore All Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/merge-pdf">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Try Merge PDF
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Popular Tools
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started with our most-used tools
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/tools">
                <Button variant="outline" size="lg">
                  View All {tools.length} Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-t bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Browse by Category
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find the perfect tool for your needs
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {categories.map((category) => {
                const Icon = categoryIcons[category]
                const categoryTools = tools.filter((t) => t.category === category)
                return (
                  <Link
                    key={category}
                    href={`/tools?category=${category}`}
                    className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold group-hover:text-primary">
                      {categoryLabels[category]}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {categoryTools.length} tools available
                    </p>
                    <ul className="mt-4 space-y-1">
                      {categoryTools.slice(0, 3).map((tool) => (
                        <li
                          key={tool.id}
                          className="text-sm text-muted-foreground"
                        >
                          {tool.name}
                        </li>
                      ))}
                    </ul>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold sm:text-3xl text-balance">
                Ready to boost your productivity?
              </h2>
              <p className="mt-4 text-muted-foreground">
                All tools are free, with no sign-up required. Start using them now.
              </p>
              <Link href="/tools">
                <Button size="lg" className="mt-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'
import { siteConfig } from '@/lib/config'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Zap, Shield, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - StudyTools AI',
  description: 'Learn about StudyTools AI - our mission to help students succeed with free, powerful productivity tools.',
}

const features = [
  {
    icon: GraduationCap,
    title: 'Built for Students',
    description: 'Every tool is designed with students in mind, addressing real academic challenges.',
  },
  {
    icon: Zap,
    title: 'Fast & Free',
    description: 'All our core tools are completely free. No hidden fees, no subscriptions required.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'PDF processing happens in your browser. Your files never leave your device.',
  },
  {
    icon: Globe,
    title: 'Always Accessible',
    description: 'Available 24/7 from any device. Study smarter, anytime, anywhere.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              About {siteConfig.name}
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Empowering students with free, powerful tools to boost productivity and achieve academic success.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We believe every student deserves access to powerful productivity tools without financial barriers. 
                  {siteConfig.name} was created to provide free, high-quality utilities that help students manage their 
                  academic workload more efficiently.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  From processing PDFs to generating study materials with AI, our tools are designed to save you time 
                  and help you focus on what matters most - learning.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold">What We Offer</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our platform includes a comprehensive suite of tools organized into three main categories:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">PDF Tools:</strong> Merge, split, compress, and convert PDFs directly in your browser.
                  </li>
                  <li>
                    <strong className="text-foreground">Student Utilities:</strong> Calculators for attendance and CGPA, plus a Pomodoro timer for focused study sessions.
                  </li>
                  <li>
                    <strong className="text-foreground">AI-Powered Tools:</strong> Get feedback on your resume and transform your notes into summaries and flashcards.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">Why Choose Us</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold">Our Commitment to Privacy</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We take your privacy seriously. Our PDF processing tools work entirely within your browser - your files 
              are never uploaded to our servers. For AI features that require server processing, we only use your data 
              to provide the requested service and do not store it permanently.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We believe in transparency. We may show ads to support our free services, but we will always be clear 
              about how your data is used.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-muted-foreground">
              Explore our tools and start boosting your productivity today.
            </p>
            <a
              href="/tools"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse All Tools
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Privacy Policy - StudyTools AI',
  description: 'Privacy policy for StudyTools AI. Learn how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p>
                Welcome to {siteConfig.name}. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <h3 className="text-xl font-medium">Information You Provide</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>Files you upload for processing (PDFs, images, documents)</li>
                <li>Text content you input for AI analysis (notes, resume text)</li>
                <li>Contact information if you reach out to us</li>
              </ul>
              
              <h3 className="text-xl font-medium">Automatically Collected Information</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Provide and improve our services</li>
                <li>Process your files and requests</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Respond to your inquiries</li>
                <li>Ensure the security of our services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Processing</h2>
              <p>
                <strong>Client-Side Processing:</strong> Our PDF tools (merge, split, compress, convert) process files entirely in your browser. 
                Your files are never uploaded to our servers for these operations.
              </p>
              <p>
                <strong>AI Features:</strong> When using AI-powered tools (Resume Checker, Notes Summarizer), the text content you submit 
                is sent to our AI processing service. This data is processed only to provide the requested analysis and is not stored permanently.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to improve your experience. These include:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Advertising cookies:</strong> Used to deliver relevant advertisements (e.g., Google AdSense)</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Third-Party Services</h2>
              <p>We may use third-party services that collect information, including:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Google Analytics for website analytics</li>
                <li>Google AdSense for advertising</li>
                <li>AI service providers for text analysis</li>
              </ul>
              <p>
                These services have their own privacy policies governing the use of your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                privacy policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  contact us
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

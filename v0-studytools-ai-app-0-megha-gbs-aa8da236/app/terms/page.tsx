import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Terms of Service - StudyTools AI',
  description: 'Terms of service for StudyTools AI. Read our terms and conditions for using our services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using {siteConfig.name} (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p>
                {siteConfig.name} provides online tools for students, including:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>PDF manipulation tools (merge, split, compress, convert)</li>
                <li>Student utilities (calculators, timers)</li>
                <li>AI-powered analysis tools (resume checker, notes summarizer)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Use the Service only for lawful purposes</li>
                <li>Not upload malicious files or content</li>
                <li>Not attempt to bypass any security measures</li>
                <li>Not use the Service to infringe on intellectual property rights</li>
                <li>Not misuse the AI features for generating harmful content</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by {siteConfig.name} and are 
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You retain ownership of any files you upload. We do not claim any intellectual property rights over the 
                content you process through our tools.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Privacy</h2>
              <p>
                Your use of the Service is also governed by our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and protect your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Disclaimer of Warranties</h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. 
                We do not warrant that:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Results from using the Service will be accurate or reliable</li>
                <li>AI-generated content will be error-free or suitable for any specific purpose</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, {siteConfig.name} shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including but not limited to loss of data, profits, or business 
                opportunities arising from your use of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. AI-Generated Content</h2>
              <p>
                Our AI-powered tools provide suggestions and analysis based on algorithms. This content:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Should not be considered professional advice</li>
                <li>May contain errors or inaccuracies</li>
                <li>Should be reviewed and verified by the user</li>
                <li>Is provided for educational and informational purposes only</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Modifications to Service</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the Service at any time without notice. 
                We shall not be liable to you or any third party for any modification, suspension, or discontinuance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
              <p>
                We may revise these Terms of Service at any time. By continuing to use the Service after changes become 
                effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws, without regard to 
                conflict of law principles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please{' '}
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

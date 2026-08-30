import Image from "next/image"

export const metadata = {
  title: "BookMiadi — Terms of Service",
  description: "Terms of Service for BookMiadi booking platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-4">
          <Image
            src="/peercoin.png"
            alt="BookMiadi"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-lg font-bold">BookMiadi</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By creating an account or using BookMiadi (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">2. Description of Service</h2>
            <p className="mt-2">
              BookMiadi is a booking and scheduling platform that allows businesses to manage appointments, staff, services, and customers. We reserve the right to modify, suspend, or discontinue the Service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">3. User Accounts</h2>
            <p className="mt-2">
              You are responsible for maintaining the security of your account and password. You agree to provide accurate and complete information when creating your account and to update such information as needed.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">4. Acceptable Use</h2>
            <p className="mt-2">
              You agree not to use the Service to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Violate any applicable law or regulation</li>
              <li>Infringe on the rights of any third party</li>
              <li>Upload or transmit malicious code or harmful content</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Use the Service in a manner that could disrupt or damage it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">5. Business Data</h2>
            <p className="mt-2">
              You retain ownership of all data you submit to the Service. You grant BookMiadi a limited license to process your data solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">6. Fees and Payments</h2>
            <p className="mt-2">
              Certain features of the Service may require payment of fees. We will notify you of any fees before they are charged. All fees are non-refundable unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">7. Termination</h2>
            <p className="mt-2">
              You may terminate your account at any time. We may suspend or terminate your account if you violate these Terms or if we believe your conduct is harmful to the Service or other users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">8. Disclaimer of Warranties</h2>
            <p className="mt-2">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">9. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, BookMiadi shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">10. Changes to Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. We will notify you of significant changes. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">11. Contact</h2>
            <p className="mt-2">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:info@lipasalama.co.tz" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                info@lipasalama.co.tz
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6">
          <a href="/signup" className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80">
            &larr; Back to sign up
          </a>
        </div>
      </main>
    </div>
  )
}

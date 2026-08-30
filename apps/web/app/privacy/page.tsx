import Image from "next/image"

export const metadata = {
  title: "BookMiadi — Privacy Policy",
  description: "Privacy Policy for BookMiadi booking platform.",
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">
              We collect the following types of information:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong className="text-foreground">Account information:</strong> Name, email address, and password</li>
              <li><strong className="text-foreground">Business information:</strong> Business name, type, address, phone, and description</li>
              <li><strong className="text-foreground">Customer data:</strong> Names, phone numbers, and email addresses of your customers</li>
              <li><strong className="text-foreground">Usage data:</strong> How you interact with the Service, including logs and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mt-2">
              We use your information to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process bookings and send notifications</li>
              <li>Communicate with you about your account and the Service</li>
              <li>Monitor and analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">3. Information Sharing</h2>
            <p className="mt-2">
              We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate the Service, and we may disclose information when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">4. Data Security</h2>
            <p className="mt-2">
              We take reasonable measures to protect your data, including encryption of passwords and secure data transmission. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">5. Data Retention</h2>
            <p className="mt-2">
              We retain your data for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">6. Cookies</h2>
            <p className="mt-2">
              The Service uses cookies and similar technologies for authentication and session management. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">7. Your Rights</h2>
            <p className="mt-2">
              You have the right to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access and review your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of promotional communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">8. Children&apos;s Privacy</h2>
            <p className="mt-2">
              The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have done so, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. We will notify you of significant changes. Continued use of the Service after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">10. Contact</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, please contact us at{" "}
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

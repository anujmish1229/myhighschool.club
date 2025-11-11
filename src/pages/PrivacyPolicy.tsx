import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto max-w-3xl px-6 pt-32 pb-24 space-y-12">
        <header>
          <p className="text-sm uppercase tracking-wide text-foreground/60">
            Privacy Policy
          </p>
          <h1 className="mt-2 text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-foreground/70">Effective Date: November 11, 2025</p>
        </header>

        <section className="space-y-8 text-foreground/70 leading-relaxed">
          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Our web app helps students create and manage websites for their school clubs.
              Protecting your privacy is important to us. This Privacy Policy explains what
              information we collect, how we use it, and your rights.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Google Login:</strong> When you sign in, we receive your name and email.
              </li>
              <li>
                <strong>Club Information:</strong> When creating a club page, we collect club name,
                description, pictures, executive roles, teacher advisor, and social media links.
              </li>
            </ul>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>To provide and manage your club pages on our platform.</li>
              <li>For account administration and authentication purposes.</li>
            </ul>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">4. How We Share Information</h2>
            <p>
              All information is kept within our platform. We do not share data with third parties
              for advertising or analytics.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Cookies and Tracking</h2>
            <p>
              We use cookies only for essential functionality, such as keeping you logged in. We do
              not use cookies for analytics or advertising.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Data Storage and Security</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>We use Supabase and Netlify to host and store your data.</li>
              <li>Your internet traffic is secured by SSL.</li>
              <li>
                We only store current club information and Google login data; we do not keep
                long-term backups.
              </li>
            </ul>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">7. User Rights</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>You can edit or delete your account and your club pages at any time.</li>
              <li>Your data is only accessible within the app and cannot be downloaded or exported.</li>
            </ul>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Children’s Privacy</h2>
            <p>
              Our service is intended for high school students and older. Users under 13 are not
              permitted.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Communications</h2>
            <p>
              Any emails or notifications are only sent via Google for account-related purposes,
              such as authentication or password resets.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Media Release Consent</h2>
            <p>
              Any people included in images uploaded must give their consent to be featured publicly.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy in the future. Any changes will be announced on our
              website.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, you can contact us at{" "}
              <a
                href="mailto:support@myhighschool.club"
                className="text-primary underline underline-offset-2"
              >
                support@myhighschool.club
              </a>
              .
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;


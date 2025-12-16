// pages/legal/terms.tsx
import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — needAI.help (BizPilot)</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-extrabold">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: {new Date().toISOString().slice(0,10)}</p>

          <h2 className="mt-8 text-xl font-bold">1. Agreement</h2>
          <p className="mt-2 text-slate-300">
            By using needAI.help — BizPilot (“Service”), you agree to these Terms.
          </p>

          <h2 className="mt-6 text-xl font-bold">2. Eligibility & Accounts</h2>
          <p className="mt-2 text-slate-300">
            You are responsible for your account and for complying with applicable laws and third-party policies (e.g. Google, Stripe).
          </p>

          <h2 className="mt-6 text-xl font-bold">3. Subscriptions & Billing</h2>
          <p className="mt-2 text-slate-300">
            Paid plans are billed by Stripe on a recurring basis until cancelled. Taxes may apply. You can cancel anytime; access
            continues until the end of the billing period.
          </p>

          <h2 className="mt-6 text-xl font-bold">4. Acceptable Use</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-300">
            <li>No unlawful, misleading, or abusive content.</li>
            <li>No attempts to bypass API rate limits or access unauthorized data.</li>
            <li>Respect third-party platform terms (Google Business Profile, Stripe, etc.).</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">5. Google & Third-Party Services</h2>
          <p className="mt-2 text-slate-300">
            The Service integrates with Google Business Profile and other providers. Availability depends on third-party APIs and quotas.
            We don’t guarantee uptime/approval of external services.
          </p>

          <h2 className="mt-6 text-xl font-bold">6. Intellectual Property</h2>
          <p className="mt-2 text-slate-300">The Service is provided “as is”; all rights reserved by us and our licensors.</p>

          <h2 className="mt-6 text-xl font-bold">7. Liability</h2>
          <p className="mt-2 text-slate-300">
            To the maximum extent permitted by law, we are not liable for indirect or consequential damages. Our aggregate liability is limited to fees paid in the last 3 months.
          </p>

          <h2 className="mt-6 text-xl font-bold">8. Termination</h2>
          <p className="mt-2 text-slate-300">We may suspend or terminate access for violations of these Terms.</p>

          <h2 className="mt-6 text-xl font-bold">9. Changes</h2>
          <p className="mt-2 text-slate-300">We may update these Terms; continued use constitutes acceptance of changes.</p>

          <h2 className="mt-6 text-xl font-bold">10. Contact</h2>
          <p className="mt-2 text-slate-300">
            Questions? <a className="underline" href="mailto:support@needai.help">support@needai.help</a>
          </p>

          <p className="mt-8 text-xs text-slate-500">
            These Terms are for general use; consult legal counsel for specific requirements in your jurisdiction.
          </p>
        </section>
      </main>
    </>
  );
}

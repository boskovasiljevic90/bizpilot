// pages/legal/privacy.tsx
import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — needAI.help (BizPilot)</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: {new Date().toISOString().slice(0,10)}</p>

          <h2 className="mt-8 text-xl font-bold">Who we are</h2>
          <p className="mt-2 text-slate-300">
            needAI.help — BizPilot (“we”, “us”, “our”) provides tools to help local businesses create posts and reply to reviews.
          </p>

          <h2 className="mt-6 text-xl font-bold">Data we process</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-300">
            <li>Account data (name, email).</li>
            <li>Billing data via Stripe (processed by Stripe; we don’t store card numbers).</li>
            <li>Google Business Profile data you connect (locations, posts, reviews) only to provide features you request.</li>
            <li>Usage and diagnostics (aggregated analytics & logs).</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">Google User Data</h2>
          <p className="mt-2 text-slate-300">
            We use Google OAuth only with your consent and only to access scopes required to list locations and publish posts/
            replies. We store access tokens securely and never sell or share Google data. You can revoke access anytime in
            your Google Account: <a className="underline" href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>.
          </p>

          <h2 className="mt-6 text-xl font-bold">Payments</h2>
          <p className="mt-2 text-slate-300">
            Subscriptions are handled by Stripe. Their privacy policy applies: <a className="underline" href="https://stripe.com/privacy">stripe.com/privacy</a>.
          </p>

          <h2 className="mt-6 text-xl font-bold">Data retention & deletion</h2>
          <p className="mt-2 text-slate-300">
            We retain data as long as your account is active and as required by law. You may request deletion by contacting us at the email below.
          </p>

          <h2 className="mt-6 text-xl font-bold">Security</h2>
          <p className="mt-2 text-slate-300">
            We use HTTPS everywhere, restricted tokens, and least-privilege access. No method is 100% secure, but we take reasonable measures to protect your data.
          </p>

          <h2 className="mt-6 text-xl font-bold">Contact</h2>
          <p className="mt-2 text-slate-300">
            For privacy requests, contact: <a className="underline" href="mailto:support@needai.help">support@needai.help</a>
          </p>

          <p className="mt-8 text-xs text-slate-500">
            This policy is provided for compliance context and does not constitute legal advice.
          </p>
        </section>
      </main>
    </>
  );
}

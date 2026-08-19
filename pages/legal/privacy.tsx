// pages/legal/privacy.tsx
import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — NeedAIHelp</title>
        <meta name="description" content="Privacy policy for NeedAIHelp and its products." />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: {new Date().toISOString().slice(0,10)}</p>

          <h2 className="mt-8 text-xl font-bold">Who we are</h2>
          <p className="mt-2 text-slate-300">
            NeedAIHelp (“we”, “us”, “our”) builds applied AI products and solution services, including Effluxa and the upcoming VisaPilot product.
          </p>

          <h2 className="mt-6 text-xl font-bold">Products and data</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-300">
            <li>Account data (name, email).</li>
            <li>Effluxa account, uploaded financial-file metadata and generated audit data needed to provide the service.</li>
            <li>Billing data processed by Paddle for Effluxa subscriptions and purchases; we do not store card numbers.</li>
            <li>Data supplied to a NeedAIHelp product is used only to provide the requested product or service.</li>
            <li>Usage and diagnostics (aggregated analytics & logs).</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">Data retention & deletion</h2>
          <p className="mt-2 text-slate-300">
            We retain product data while it is needed to provide the requested service. Effluxa users can delete individual reports or their complete account from Account Settings. Paddle may retain transaction records required for merchant, tax, fraud-prevention or legal obligations.
          </p>

          <h2 className="mt-6 text-xl font-bold">Security</h2>
          <p className="mt-2 text-slate-300">
            We use HTTPS, restricted secrets, access controls and least-privilege operational access. No method is 100% secure, but we take reasonable measures to protect data.
          </p>

          <h2 className="mt-6 text-xl font-bold">Contact</h2>
          <p className="mt-2 text-slate-300">
            For privacy requests, contact: <a className="underline" href="mailto:support@effluxa.com">support@effluxa.com</a>
          </p>

          <p className="mt-8 text-xs text-slate-500">
            This policy is provided for compliance context and does not constitute legal advice.
          </p>
        </section>
      </main>
    </>
  );
}

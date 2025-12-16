// pages/pricing.tsx
import Head from "next/head";

export default function Pricing() {
  return (
    <>
      <Head><title>Pricing — BizPilot</title></Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-extrabold">Pricing</h1>
          <p className="mt-2 text-slate-300">Start free. Upgrade when ready.</p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold">Free — €0</h3>
              <ul className="mt-4 space-y-2 text-slate-300 text-sm">
                <li>• Draft 3 posts / month</li>
                <li>• Draft 5 review replies / month</li>
                <li>• No publishing</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-teal-600 p-6">
              <h3 className="text-xl font-bold">Pro — €29.99 / month</h3>
              <ul className="mt-4 space-y-2 text-slate-300 text-sm">
                <li>• Unlimited drafts</li>
                <li>• Priority support</li>
              </ul>
              <form action="/api/checkout_sessions" method="POST" className="mt-6">
                <button className="px-4 py-2 rounded-lg bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400" type="submit">
                  Start 14-day Trial
                </button>
              </form>
              <p className="mt-2 text-xs text-slate-400">No charges today. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

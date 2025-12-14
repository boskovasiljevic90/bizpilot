// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>needAI.help — BizPilot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold">
              need<span className="text-teal-300">AI</span>.help
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-slate-300 hover:text-white">Pricing</Link>
            <a href="/api/auth/google" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20">Connect Google Business</a>
          </nav>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Autonomous Google Business Manager, powered by AI.
          </h1>
          <p className="mt-4 text-slate-300">
            BizPilot drafts posts, replies to reviews, and helps maintain business info — across all languages.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/api/auth/google?plan=free"
              className="px-5 py-3 rounded-lg bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400"
            >
              Start Free
            </a>
            <a
              href="/api/stripe/createCheckout"
              className="px-5 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              Start 14-day Trial — €29.99/mo
            </a>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Free plan to try. Pro plan €29.99 / month (14-day trial).
          </p>
        </section>
      </main>
    </>
  );
}

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
            <span className="text-slate-400">BizPilot</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="hover:text-teal-300">Pricing</Link>
            <Link href="/dashboard" className="hover:text-teal-300">Dashboard</Link>
          </nav>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            AI assistant for your <span className="text-teal-300">local business</span>
          </h1>
          <p className="mt-5 text-lg text-slate-300 max-w-2xl">
            Draft posts and reply to reviews in seconds. Start with a free plan, upgrade when ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pricing" className="px-5 py-3 rounded-lg bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400">
              Get Started
            </Link>
            <Link href="/dashboard" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20">
              Try the Demo
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

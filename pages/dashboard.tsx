// pages/dashboard.tsx
import Head from "next/head";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard — BizPilot</title>
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-extrabold">
            need<span className="text-teal-300">AI</span>.help
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white">Pricing</Link>
          </nav>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-300 mb-6">
            Poveži Google Business nalog i izaberi lokaciju za AI akcije.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold mb-2">Google Business</h2>
              <p className="text-sm text-slate-400 mb-4">
                Ako nisi povezan, klikni ispod.
              </p>
              <a href="/api/auth/google" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 inline-block">
                Connect / Reconnect
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold mb-2">Pretplata</h2>
              <p className="text-sm text-slate-400">Free ili Pro (29.99€/mo, 14 dana trial)</p>
              <div className="mt-4 flex gap-3">
                <a href="/api/auth/google?plan=free" className="px-4 py-2 rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-400">Use Free</a>
                <a href="/api/stripe/createCheckout" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Start Trial</a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 p-6">
            <h2 className="font-bold mb-2">AI akcije (MVP)</h2>
            <p className="text-sm text-slate-400 mb-4">
              Draft post & reply su dostupni odmah. Autopilot (cron + KV) ide u sledećem koraku.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Generate Post (Draft)</button>
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Generate Review Reply (Draft)</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

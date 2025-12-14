// pages/pricing.tsx
import Head from "next/head";

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing — BizPilot</title>
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-extrabold">Pricing</h1>
          <p className="mt-2 text-slate-300">Započni besplatno, ili aktiviraj 14 dana Pro trial.</p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold">Free — €0</h3>
              <ul className="mt-4 space-y-2 text-slate-300 text-sm">
                <li>• Povezivanje sa Google Business</li>
                <li>• AI draft za post i odgovor na recenziju</li>
                <li>• Bez objavljivanja (samo draftovi)</li>
              </ul>
              <a
                href="/api/auth/google?plan=free"
                className="mt-6 inline-block px-4 py-2 rounded-lg bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400"
              >
                Start Free
              </a>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-2xl font-bold">Pro — €29.99/mo</h3>
              <p className="text-sm text-slate-400">14 dana trial, otkazuješ kad želiš.</p>
              <ul className="mt-4 space-y-2 text-slate-300 text-sm">
                <li>• Autopilot: odgovori na recenzije i postovi</li>
                <li>• Veći limiti i prioritetna obrada</li>
                <li>• Priprema za menadžment radnog vremena i informacija</li>
              </ul>
              <a
                href="/api/stripe/createCheckout"
                className="mt-6 inline-block px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Start 14-day Trial
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import Head from "next/head";
import Image from "next/image";

function BrandMark() {
  return (
    <Image
      src="/brand/needaihelp-mark.svg"
      alt=""
      width={40}
      height={40}
      className="h-9 w-9 object-contain"
      aria-hidden="true"
    />
  );
}

function BrandLogo() {
  return (
    <Image
      src="/brand/needaihelp-logo.svg"
      alt="NeedAIHelp"
      width={220}
      height={56}
      className="h-10 w-auto sm:h-11"
      priority
    />
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>NeedAIHelp — Applied AI solutions</title>
        <meta
          name="description"
          content="NeedAIHelp builds focused AI products and solution services for real business workflows."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/brand/needaihelp-mark.svg" />
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
        <header className="border-b border-slate-200/80 bg-[#f8fafc] text-slate-950">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
            <a href="/" className="flex items-center" aria-label="NeedAIHelp home">
              <BrandLogo />
            </a>

            <nav className="flex items-center gap-4 text-sm text-slate-600 sm:gap-8 sm:text-base">
              <a className="transition hover:text-slate-950" href="#about">
                About
              </a>
              <a className="transition hover:text-slate-950" href="#products">
                Products
              </a>
              <a className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-700 sm:inline-flex" href="mailto:support@effluxa.com">
                Get in touch
              </a>
            </nav>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-16 sm:px-10 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
              NeedAIHelp · Applied AI solutions
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              We turn difficult workflows into useful AI products.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              NeedAIHelp builds focused AI products and practical solution services for the work
              people need to get done — clearly, repeatedly and with less friction.
            </p>
            <a
              href="#products"
              className="mt-9 inline-flex items-center rounded-full bg-teal-300 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-teal-200"
            >
              Explore our products <span className="ml-2">→</span>
            </a>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-teal-300/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 sm:p-9">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  NeedAIHelp
                </span>
                <span className="rounded-full border border-teal-300/40 px-3 py-1 text-xs font-semibold text-teal-200">
                  AI solution services
                </span>
              </div>
              <div className="py-12">
                <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Focused products.
                </p>
                <p className="mt-3 text-2xl font-semibold text-teal-200 sm:text-3xl">
                  Practical by design.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
                    Live
                  </span>
                  Effluxa
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
                    Coming soon
                  </span>
                  VisaPilot
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
              What we do
            </p>
            <div>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                We make specialised AI feel simple, useful and ready for everyday decisions.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Our products are designed around specific problems, not generic promises. We
                combine thoughtful product design with practical AI to help people move from
                information to action.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 py-24 sm:px-10 md:grid-cols-3">
          {[
            ["Find the signal", "We focus AI on the information that matters, not on adding another complicated dashboard."],
            ["Design the workflow", "Each product is shaped around a real job, with clear inputs, useful outputs and a human decision at the centre."],
            ["Keep improving", "We ship practical systems that get better through real use, feedback and disciplined iteration."],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7">
              <span className="text-sm font-bold text-teal-300">0{index + 1}</span>
              <h3 className="mt-8 text-2xl font-bold tracking-tight">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </section>

        <section id="products" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
                Our products
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Built for a purpose.
              </h2>
            </div>
            <p className="max-w-sm text-slate-400">
              Explore the products NeedAIHelp is bringing to market.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex min-h-[25rem] flex-col justify-between rounded-[2rem] bg-slate-100 p-7 text-slate-950 sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    Available now
                  </span>
                  <span className="text-sm font-semibold text-slate-500">01</span>
                </div>
                <h3 className="mt-12 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Effluxa
                </h3>
                <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
                  AI financial intelligence for SMEs, CFOs and consultants — helping teams find
                  financial leakage before it becomes profit loss.
                </p>
              </div>
              <a
                className="mt-10 inline-flex w-fit items-center font-bold text-blue-700 transition hover:text-blue-500"
                href="https://www.effluxa.com"
                target="_blank"
                rel="noreferrer"
              >
                Visit Effluxa <span className="ml-2">↗</span>
              </a>
            </article>

            <article className="flex min-h-[25rem] flex-col justify-between rounded-[2rem] border border-white/15 bg-white/[0.06] p-7 sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-teal-300/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-200">
                    Coming soon
                  </span>
                  <span className="text-sm font-semibold text-slate-500">02</span>
                </div>
                <h3 className="mt-12 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  VisaPilot
                </h3>
                <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                  An AI-powered product for making visa and immigration workflows easier to
                  understand, prepare and navigate.
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center font-bold text-teal-200">
                Launching soon <span className="ml-2">→</span>
              </span>
            </article>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <p className="font-semibold text-white">NeedAIHelp</p>
                  <p className="mt-1">Applied AI products and solution services.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a className="transition hover:text-white" href="/legal/privacy">Privacy</a>
              <a className="transition hover:text-white" href="/legal/terms">Terms</a>
              <a className="transition hover:text-white" href="mailto:support@effluxa.com">Contact</a>
              <p>Effluxa is a product by NeedAIHelp.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

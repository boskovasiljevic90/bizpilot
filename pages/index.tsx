import Head from "next/head";

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
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
          <a href="/" className="text-xl font-extrabold tracking-tight sm:text-2xl" aria-label="NeedAIHelp home">
            Need<span className="text-teal-300">AI</span>Help
          </a>

          <nav className="flex items-center gap-5 text-sm text-slate-300 sm:gap-8 sm:text-base">
            <a className="transition hover:text-white" href="#about">
              About
            </a>
            <a className="transition hover:text-white" href="#products">
              Products
            </a>
          </nav>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-16 sm:px-10 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
              Applied AI for real work
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              Useful AI products for the way business actually works.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              NeedAIHelp builds focused AI solutions that turn complex workflows into clear,
              repeatable experiences.
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
                  Two focused products.
                </p>
                <p className="mt-3 text-2xl font-semibold text-teal-200 sm:text-3xl">
                  One practical approach.
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
              Explore what is available today and what is coming next from NeedAIHelp.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex min-h-[25rem] flex-col justify-between rounded-[2rem] bg-slate-100 p-7 text-slate-950 sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    Live product
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
                Explore Effluxa <span className="ml-2">↗</span>
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
                  understand and navigate.
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
              <p className="font-semibold text-white">NeedAIHelp</p>
              <p className="mt-1">Applied AI products and solution services.</p>
            </div>
            <p>Effluxa is a product by NeedAIHelp.</p>
          </div>
        </footer>
      </main>
    </>
  );
}

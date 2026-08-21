import Head from "next/head";
import { FormEvent, useState } from "react";

const supportEmail = "support@needai.help";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailSubject = subject.trim() || "NeedAIHelp enquiry";
    const emailBody = [
      `Name: ${name.trim()}`,
      `Reply email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }

  return (
    <>
      <Head>
        <title>Contact NeedAIHelp — Applied AI solutions</title>
        <meta
          name="description"
          content="Contact NeedAIHelp about applied AI products, solution services and partnerships."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
        <header className="border-b border-slate-200 bg-white text-slate-950">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-10 sm:py-6">
            <a href="/" className="block shrink-0" aria-label="NeedAIHelp home">
              <img src="/brand/needaihelp-wordmark.svg" className="h-8 w-auto sm:h-10" alt="NeedAIHelp" />
            </a>

            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:gap-8 sm:text-base">
              <a className="transition hover:text-blue-700" href="/#about">
                About
              </a>
              <a className="transition hover:text-blue-700" href="/#products">
                Products
              </a>
              <a
                className="rounded-full border border-slate-300 px-3 py-2 text-slate-950 transition hover:border-blue-600 hover:text-blue-700 sm:px-5 sm:py-2.5 sm:text-base"
                href={`mailto:${supportEmail}`}
              >
                Get in touch
              </a>
            </nav>
          </div>
        </header>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-10 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
              Get in touch
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              Contact NeedAIHelp.
            </h1>
            <p className="mt-7 text-lg leading-8 text-slate-300 sm:text-xl">
              Questions about our products, applied AI services or a potential partnership? Send us a message.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-7 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 sm:p-9">
              <h2 className="text-3xl font-extrabold tracking-tight">Support</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Use the form for product questions, partnership enquiries, feedback or help with an Effluxa-related request.
              </p>

              <div className="mt-9">
                <div className="font-bold text-white">Email</div>
                <a className="mt-2 inline-block text-lg text-teal-200 underline-offset-4 hover:underline" href={`mailto:${supportEmail}`}>
                  {supportEmail}
                </a>
              </div>

              <div className="mt-8">
                <div className="font-bold text-white">Response time</div>
                <div className="mt-2 text-slate-300">Business days, as soon as possible.</div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] bg-white p-7 text-slate-950 shadow-2xl shadow-black/20 sm:p-9"
            >
              <div className="grid gap-5">
                <div>
                  <label className="font-bold" htmlFor="name">Name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-blue-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="font-bold" htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-blue-600"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="font-bold" htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-blue-600"
                    placeholder="Product, partnership, feedback..."
                  />
                </div>

                <div>
                  <label className="font-bold" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="mt-2 min-h-[150px] w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-blue-600"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="h-14 rounded-2xl bg-slate-950 px-5 text-base font-extrabold text-white transition hover:bg-blue-700"
                >
                  Send Message
                </button>
                <p className="text-sm leading-6 text-slate-500">
                  Submitting opens your email app addressed to {supportEmail}.
                </p>
              </div>
            </form>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div className="flex items-center gap-3">
              <img src="/brand/needaihelp-wordmark-dark.svg" className="h-8 w-auto" alt="NeedAIHelp" />
              <p>Applied AI products and solution services.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a className="transition hover:text-teal-200" href="/legal/privacy">Privacy</a>
              <a className="transition hover:text-teal-200" href="/legal/terms">Terms</a>
              <span>Effluxa is a product by NeedAIHelp.</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use — NeedAIHelp</title>
        <meta
          name="description"
          content="Terms of use for the NeedAIHelp company website and product links."
        />
      </Head>

      <main className="min-h-screen bg-[#07111f] text-slate-100">
        <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
          <a className="text-teal-200 hover:underline" href="/">← Back to NeedAIHelp</a>
          <h1 className="mt-10 text-4xl font-extrabold tracking-tight sm:text-5xl">Terms of Use</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: 21 August 2026</p>

          <div className="mt-10 space-y-7 text-slate-300 [&_h2]:text-xl [&_h2]:font-bold [&_p]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            <section>
              <h2>1. Website use</h2>
              <p className="mt-2">
                This website presents NeedAIHelp, its applied AI solution services and its product portfolio.
                You may use it for lawful informational, support and business-enquiry purposes.
              </p>
            </section>

            <section>
              <h2>2. Products and availability</h2>
              <p className="mt-2">
                Effluxa is a NeedAIHelp product available at its own website. VisaPilot is listed as coming
                soon and is not available for purchase through this website. Product features, availability
                and documentation may change as the products develop.
              </p>
            </section>

            <section>
              <h2>3. No professional advice</h2>
              <p className="mt-2">
                References to AI products, financial workflows, visa processes or potential outcomes are for
                general information only. They are not financial, accounting, tax, legal, immigration or
                investment advice, and no result or savings outcome is guaranteed.
              </p>
            </section>

            <section>
              <h2>4. Acceptable use</h2>
              <ul className="mt-2">
                <li>Do not use the website for unlawful, fraudulent or abusive activity.</li>
                <li>Do not attempt to disrupt, probe or gain unauthorised access to the website or its services.</li>
                <li>Do not send passwords, payment-card information or unnecessary sensitive documents through contact email.</li>
              </ul>
            </section>

            <section>
              <h2>5. Product terms and payments</h2>
              <p className="mt-2">
                When you use Effluxa, the Effluxa product terms and privacy information apply. Purchases and
                subscriptions are processed through Paddle, which provides the applicable checkout, billing,
                receipt and customer-portal experience for that product.
              </p>
            </section>

            <section>
              <h2>6. Intellectual property</h2>
              <p className="mt-2">
                NeedAIHelp names, logos, designs, copy and original website materials belong to NeedAIHelp or
                its licensors. You may not copy, modify or commercially reuse them without permission.
              </p>
            </section>

            <section>
              <h2>7. Changes and contact</h2>
              <p className="mt-2">
                We may update these terms as the company, website or products change. Questions can be sent to
                <a className="ml-1 text-teal-200 underline" href="mailto:support@needai.help">support@needai.help</a>.
              </p>
            </section>
          </div>

          <p className="mt-10 text-xs leading-6 text-slate-500">
            These terms describe the current NeedAIHelp website baseline and are not legal advice. Please
            obtain jurisdiction-specific legal advice where required.
          </p>
        </section>
      </main>
    </>
  );
}

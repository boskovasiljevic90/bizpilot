import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — NeedAIHelp</title>
        <meta
          name="description"
          content="Privacy information for the NeedAIHelp company website and contact requests."
        />
      </Head>

      <main className="min-h-screen bg-[#07111f] text-slate-100">
        <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
          <a className="text-teal-200 hover:underline" href="/">← Back to NeedAIHelp</a>
          <h1 className="mt-10 text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: 21 August 2026</p>

          <div className="mt-10 space-y-7 text-slate-300 [&_h2]:text-xl [&_h2]:font-bold [&_p]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            <section>
              <h2>Who we are</h2>
              <p className="mt-2">
                NeedAIHelp is an applied AI solutions company. Our portfolio includes Effluxa, an AI
                financial intelligence product, and VisaPilot, which is currently in development.
              </p>
            </section>

            <section>
              <h2>Information we receive</h2>
              <p className="mt-2">
                The NeedAIHelp company website is primarily an informational site. We receive information
                that you choose to send to us, such as your name, email address, subject and message when
                you contact support or make a business enquiry. Hosting and security providers may also
                process basic technical information needed to deliver and protect the website.
              </p>
            </section>

            <section>
              <h2>How we use information</h2>
              <ul className="mt-2">
                <li>To answer support, partnership and product enquiries.</li>
                <li>To operate, secure and improve the NeedAIHelp website.</li>
                <li>To direct you to the relevant product when you choose to explore Effluxa or VisaPilot.</li>
              </ul>
            </section>

            <section>
              <h2>Product-specific services</h2>
              <p className="mt-2">
                If you use Effluxa, that product processes account, uploaded-document and report data under
                the Effluxa privacy information. Effluxa payments are handled by Paddle. NeedAIHelp does not
                store card numbers. Paddle acts as Merchant of Record for digital products sold through its
                checkout and handles the related payment and tax transaction functions.
              </p>
            </section>

            <section>
              <h2>Retention and deletion</h2>
              <p className="mt-2">
                Contact enquiries are kept only for as long as reasonably needed to respond, maintain a
                business record or resolve a dispute. You can request deletion of personal information held
                by NeedAIHelp by emailing support@needai.help. Product account and billing retention is handled
                under the relevant product policy and provider requirements.
              </p>
            </section>

            <section>
              <h2>Security</h2>
              <p className="mt-2">
                We use reasonable technical and organisational measures to protect information. No internet
                service can guarantee absolute security, so please do not send passwords, card numbers or
                unnecessary sensitive financial documents by email.
              </p>
            </section>

            <section>
              <h2>Contact</h2>
              <p className="mt-2">
                Privacy requests and questions: <a className="text-teal-200 underline" href="mailto:support@needai.help">support@needai.help</a>
              </p>
            </section>
          </div>

          <p className="mt-10 text-xs leading-6 text-slate-500">
            This policy describes the current NeedAIHelp website baseline and is not legal advice. Please
            obtain jurisdiction-specific legal advice where required.
          </p>
        </section>
      </main>
    </>
  );
}

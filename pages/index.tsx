// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">NeedAI.help</h1>
      <p className="mb-6">
        BizPilot – AI menadžer za Google Business. Poveži nalog, generiši objave i odgovori na recenzije.
      </p>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded bg-black text-white"
        >
          Open Dashboard
        </Link>
        <a
          href="/api/auth/google"
          className="px-4 py-2 rounded border"
        >
          Connect Google Business
        </a>
      </div>

      <hr className="my-8" />

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Poveži Google Business nalog.</li>
          <li>Izaberi account i lokaciju.</li>
          <li>Koristi AI za objave, odgovore i insight-e.</li>
        </ol>
      </section>
    </div>
  );
}

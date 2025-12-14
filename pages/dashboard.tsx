// pages/dashboard.tsx
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [postLoading, setPostLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [postTopic, setPostTopic] = useState("special offer this week");
  const [reviewSample, setReviewSample] = useState("We loved the cappuccino and the staff were super friendly!");

  async function handleGeneratePost() {
    try {
      setPostLoading(true);
      setPostText("");
      const r = await fetch("/api/ai/postDraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTopic }),
      });
      const j = await r.json();
      if (j?.error) throw new Error(j.error);
      setPostText(j?.text || "");
    } catch (e: any) {
      setPostText(`Error: ${e?.message || String(e)}`);
    } finally {
      setPostLoading(false);
    }
  }

  async function handleGenerateReply() {
    try {
      setReplyLoading(true);
      setReplyText("");
      const r = await fetch("/api/ai/replyDraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: reviewSample }),
      });
      const j = await r.json();
      if (j?.error) throw new Error(j.error);
      setReplyText(j?.text || "");
    } catch (e: any) {
      setReplyText(`Error: ${e?.message || String(e)}`);
    } finally {
      setReplyLoading(false);
    }
  }

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
            Connect Google Business and use AI actions. Drafts appear below.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold mb-2">Google Business</h2>
              <p className="text-sm text-slate-400 mb-4">
                If you’re not connected, click below.
              </p>
              <a href="/api/auth/google" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 inline-block">
                Connect / Reconnect
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold mb-2">Subscription</h2>
              <p className="text-sm text-slate-400">Free or Pro (€29.99/mo, 14-day trial)</p>
              <div className="mt-4 flex gap-3">
                <a href="/api/auth/google?plan=free" className="px-4 py-2 rounded-lg bg-teal-500 text-slate-900 hover:bg-teal-400">Use Free</a>
                <a href="/api/stripe/createCheckout" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Start Trial</a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 p-6">
            <h2 className="font-bold mb-2">AI actions (MVP)</h2>
            <p className="text-sm text-slate-400 mb-4">
              Generates drafts you can copy. Autopilot (cron + KV + publishing) comes next.
            </p>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Post topic</label>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={postTopic}
                  onChange={(e) => setPostTopic(e.target.value)}
                  placeholder="e.g., new menu items this week"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Sample review</label>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={reviewSample}
                  onChange={(e) => setReviewSample(e.target.value)}
                  placeholder="Paste a customer review here"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleGeneratePost}
                disabled={postLoading}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
              >
                {postLoading ? "Generating Post..." : "Generate Post (Draft)"}
              </button>

              <button
                onClick={handleGenerateReply}
                disabled={replyLoading}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
              >
                {replyLoading ? "Generating Reply..." : "Generate Review Reply (Draft)"}
              </button>
            </div>

            {/* Outputs */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-slate-400">Post Draft</label>
                <textarea
                  className="mt-2 w-full h-48 bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Review Reply Draft</label>
                <textarea
                  className="mt-2 w-full h-48 bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

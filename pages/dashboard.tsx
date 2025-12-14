// pages/dashboard.tsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

type Settings = {
  enabled: boolean;
  frequency: "daily" | "weekly";
  businessType: string;
  locale: string;
};

type QueueItem = { ts: number; type: "post" | "reply"; text: string };

export default function Dashboard() {
  // AI buttons (postojeći MVP)
  const [postLoading, setPostLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [postTopic, setPostTopic] = useState("special offer this week");
  const [reviewSample, setReviewSample] = useState("We loved the cappuccino and the staff were super friendly!");

  // Autopilot state
  const [settings, setSettings] = useState<Settings>({
    enabled: false,
    frequency: "weekly",
    businessType: "local business",
    locale: "en",
  });
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [posts, setPosts] = useState<QueueItem[]>([]);
  const [replies, setReplies] = useState<QueueItem[]>([]);

  async function loadSettings() {
    const r = await fetch("/api/autopilot/settings");
    const j = await r.json();
    if (j?.ok) setSettings(j.settings);
  }
  async function saveSettings(next: Partial<Settings>) {
    setSaving(true);
    const r = await fetch("/api/autopilot/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const j = await r.json();
    if (j?.ok) setSettings(j.settings);
    setSaving(false);
  }
  async function loadQueue() {
    const r = await fetch("/api/autopilot/queue");
    const j = await r.json();
    if (j?.ok) {
      setPosts(j.posts);
      setReplies(j.replies);
    }
  }
  async function runNow() {
    setRunning(true);
    const r = await fetch("/api/cron/run", { method: "POST" });
    await r.json().catch(() => ({}));
    setRunning(false);
    loadQueue();
  }

  useEffect(() => {
    loadSettings();
    loadQueue();
  }, []);

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
          <p className="text-slate-300 mb-6">Connect Google Business and use AI actions.</p>

          {/* SUBSCRIPTION + CONNECT */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold mb-2">Google Business</h2>
              <p className="text-sm text-slate-400 mb-4">If you’re not connected, click below.</p>
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

          {/* AI ACTIONS (manual) */}
          <div className="mt-10 rounded-2xl border border-white/10 p-6">
            <h2 className="font-bold mb-2">AI actions (manual drafts)</h2>
            <p className="text-sm text-slate-400 mb-4">Generate drafts you can copy.</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Post topic</label>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={postTopic}
                  onChange={(e) => setPostTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Sample review</label>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-3"
                  value={reviewSample}
                  onChange={(e) => setReviewSample(e.target.value)}
                />
              </div>
            </div>

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

          {/* AUTOPILOT */}
          <div className="mt-10 rounded-2xl border border-emerald-500/30 p-6">
            <h2 className="font-bold mb-2">Autopilot</h2>
            <p className="text-sm text-slate-400 mb-4">
              When enabled, BizPilot generates scheduled drafts (posts & review replies) and stores them below.
            </p>

            <div className="grid md:grid-cols-4 gap-3 items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => saveSettings({ enabled: e.target.checked })}
                />
                <span>Enabled</span>
              </label>

              <div>
                <div className="text-sm text-slate-400">Frequency</div>
                <select
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-2"
                  value={settings.frequency}
                  onChange={(e) => saveSettings({ frequency: e.target.value as any })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-slate-400">Business type</div>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-2"
                  value={settings.businessType}
                  onChange={(e) => saveSettings({ businessType: e.target.value })}
                />
              </div>

              <div>
                <div className="text-sm text-slate-400">Language</div>
                <input
                  className="mt-2 w-full bg-slate-900/60 border border-white/10 rounded-lg p-2"
                  value={settings.locale}
                  onChange={(e) => saveSettings({ locale: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={runNow}
                disabled={running}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-50"
              >
                {running ? "Running..." : "Run Autopilot now"}
              </button>
              <button
                onClick={loadQueue}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Refresh queue
              </button>
              {saving && <span className="text-slate-400 text-sm">Saving…</span>}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="font-semibold mb-2">Generated Posts</h3>
                <div className="space-y-3">
                  {posts.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/60 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{new Date(p.ts).toLocaleString()}</div>
                      <div className="whitespace-pre-wrap">{p.text}</div>
                    </div>
                  ))}
                  {posts.length === 0 && <div className="text-sm text-slate-400">No posts yet.</div>}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Generated Review Replies</h3>
                <div className="space-y-3">
                  {replies.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900/60 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{new Date(p.ts).toLocaleString()}</div>
                      <div className="whitespace-pre-wrap">{p.text}</div>
                    </div>
                  ))}
                  {replies.length === 0 && <div className="text-sm text-slate-400">No replies yet.</div>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

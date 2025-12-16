// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type GLoc = { account: string; location: { name: string; locationName?: string; title?: string } };

export default function Dashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [locs, setLocs] = useState<GLoc[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [postText, setPostText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [replyText, setReplyText] = useState("");

  async function fetchLocations() {
    setLoading(true);
    try {
      const r = await fetch("/api/google/locations");
      const j = await r.json();
      setLocs(j.locations || []);
    } finally {
      setLoading(false);
    }
  }

  async function publishPost() {
    if (!selected || !postText) return alert("Select location & enter text");
    setLoading(true);
    try {
      const locationName = selected; // "accounts/X/locations/Y"
      const accountName = locationName.split("/locations/")[0];
      const r = await fetch("/api/google/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountName, locationName, summary: postText }),
      });
      const j = await r.json();
      if (r.ok) alert("Post published ✅");
      else alert("Failed: " + j.error);
    } finally {
      setLoading(false);
    }
  }

  async function replyReview() {
    if (!reviewName || !replyText) return alert("Enter reviewName & reply text");
    setLoading(true);
    try {
      const r = await fetch("/api/google/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewName, comment: replyText }),
      });
      const j = await r.json();
      if (r.ok) alert("Replied ✅");
      else alert("Failed: " + j.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold">
            need<span className="text-teal-300">AI</span>.help
          </span>
          <span className="text-slate-400">BizPilot</span>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-400">{session.user?.email}</span>
              <button onClick={() => signOut()} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">Sign out</button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="px-3 py-2 rounded bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400">
              Connect Google
            </button>
          )}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        {/* GOOGLE LOCATIONS */}
        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold">Google Business Profile</h2>
          <p className="text-sm text-slate-400">List locations & publish Local Post</p>
          <div className="mt-3 flex gap-2">
            <button disabled={!session || loading} onClick={fetchLocations} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50">
              Load Locations
            </button>
          </div>

          <div className="mt-3">
            <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full bg-transparent rounded-lg border border-white/10 p-2">
              <option value="">Select a location…</option>
              {locs.map((x, i) => (
                <option key={i} value={x.location.name}>{x.location.title || x.location.name}</option>
              ))}
            </select>
          </div>

          <textarea
            className="mt-3 w-full h-28 bg-transparent rounded-lg border border-white/10 p-3"
            placeholder="Local Post text (summary)"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          <button onClick={publishPost} disabled={!session || loading} className="mt-3 px-4 py-2 rounded bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400 disabled:opacity-50">
            Publish Local Post (LIVE)
          </button>
        </div>

        {/* REVIEW REPLY */}
        <div className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold">Reply to Review</h2>
          <input
            className="mt-3 w-full bg-transparent rounded-lg border border-white/10 p-2"
            placeholder='Review resource name e.g. "accounts/XXX/locations/YYY/reviews/ZZZ"'
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
          />
          <textarea
            className="mt-3 w-full h-28 bg-transparent rounded-lg border border-white/10 p-3"
            placeholder="Reply text…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={replyReview} disabled={!session || loading} className="mt-3 px-4 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50">
            Send Reply (LIVE)
          </button>
        </div>
      </section>
    </main>
  );
}

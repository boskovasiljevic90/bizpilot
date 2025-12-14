// pages/dashboard.tsx
import { useEffect, useState } from "react";

type Who = {
  loggedIn: boolean;
  email?: string | null;
  plan?: "free" | "pro" | null;
};

export default function Dashboard() {
  const [who, setWho] = useState<Who>({ loggedIn: false });
  const [bizType, setBizType] = useState("");
  const [locale, setLocale] = useState("en");
  const [specials, setSpecials] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);

  useEffect(() => {
    fetch("/api/auth/whoami")
      .then(r => r.json())
      .then(d => setWho({ loggedIn: d.loggedIn, email: d.email, plan: d.plan }))
      .catch(() => setWho({ loggedIn: false }));
  }, []);

  async function genPost() {
    setLoadingPost(true);
    setPostText("");
    try {
      const r = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: bizType, locale, specials }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setPostText(j.post || "");
    } catch (e: any) {
      setPostText(`Error: ${e?.message || e}`);
    } finally {
      setLoadingPost(false);
    }
  }

  async function genReply() {
    setLoadingReply(true);
    setReplyText("");
    try {
      const r = await fetch("/api/ai/replyReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: reviewInput, locale }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setReplyText(j.reply || "");
    } catch (e: any) {
      setReplyText(`Error: ${e?.message || e}`);
    } finally {
      setLoadingReply(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>BizPilot Dashboard</h1>
      <p style={{ marginBottom: 16, opacity: 0.8 }}>
        {who.loggedIn ? (
          <>Logged in as <b>{who.email || "unknown"}</b> — Plan: <b>{who.plan || "free"}</b></>
        ) : (
          <>Not connected. <a href="/api/auth/google">Connect Google Business</a></>
        )}
      </p>

      {!who.loggedIn && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <b>Connect first:</b> <a href="/api/auth/google">Sign in with Google &amp; grant Business Profile access</a>
        </div>
      )}

      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 16, borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Generate Google Business Post</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input
              value={bizType}
              onChange={e => setBizType(e.target.value)}
              placeholder="Business type e.g. 'Bakery'"
              style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
            <input
              value={locale}
              onChange={e => setLocale(e.target.value)}
              placeholder="Locale (e.g. en, sr, de...)"
              style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
          </div>
          <input
            value={specials}
            onChange={e => setSpecials(e.target.value)}
            placeholder="Specials/promo (optional)"
            style={{ width: "100%", padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 12 }}
          />
          <button
            onClick={genPost}
            disabled={!who.loggedIn || loadingPost}
            style={{ padding: "10px 14px", borderRadius: 8, background: "#111827", color: "#fff", border: "none" }}
          >
            {loadingPost ? "Generating..." : "Generate Post"}
          </button>
          <textarea
            readOnly
            value={postText}
            placeholder="AI post will appear here..."
            style={{ width: "100%", minHeight: 150, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 12 }}
          />
        </div>

        <div style={{ border: "1px solid #e5e7eb", padding: 16, borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Reply to a Review</h2>
          <textarea
            value={reviewInput}
            onChange={e => setReviewInput(e.target.value)}
            placeholder="Paste customer review text..."
            style={{ width: "100%", minHeight: 120, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 12 }}
          />
          <button
            onClick={genReply}
            disabled={!who.loggedIn || loadingReply}
            style={{ padding: "10px 14px", borderRadius: 8, background: "#111827", color: "#fff", border: "none" }}
          >
            {loadingReply ? "Generating..." : "Generate Reply"}
          </button>
          <textarea
            readOnly
            value={replyText}
            placeholder="AI reply will appear here..."
            style={{ width: "100%", minHeight: 150, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 12 }}
          />
        </div>
      </section>

      <p style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
        Autopilot (posts/replies/updates) pokreću Cron + KV u pozadini. Ovaj ekran je ručna kontrola.
      </p>
    </div>
  );
}

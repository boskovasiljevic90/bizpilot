import { useEffect, useState } from "react";

type Who = {
  loggedIn: boolean;
  email?: string;
  plan?: "free" | "pro" | null;
};

export default function Dashboard() {
  const [who, setWho] = useState<Who>({ loggedIn: false });
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [ratingInput, setRatingInput] = useState<number | undefined>(5);
  const [locale, setLocale] = useState("en");
  const [bizType, setBizType] = useState("");
  const [specials, setSpecials] = useState("");

  useEffect(() => {
    // minimal whoami (možeš zadržati postojeći /api/auth/whoami ako već ima)
    fetch("/api/auth/whoami")
      .then(r => r.json())
      .then(d => {
        setWho({
          loggedIn: !!d?.loggedIn,
          email: d?.email || undefined,
          plan: d?.plan || null
        });
      })
      .catch(() => setWho({ loggedIn: false }));
  }, []);

  async function handleGeneratePost() {
    setLoadingPost(true);
    setPostText("");
    try {
      const r = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ businessType: bizType || undefined, locale, specials: specials || undefined })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "failed");
      setPostText(j.post || "");
    } catch (e: any) {
      setPostText(`Error: ${e?.message || "failed"}`);
    } finally {
      setLoadingPost(false);
    }
  }

  async function handleGenerateReply() {
    if (!reviewInput?.trim()) {
      setReplyText("Please paste a customer review first.");
      return;
    }
    setLoadingReply(true);
    setReplyText("");
    try {
      const r = await fetch("/api/ai/respondReview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reviewText: reviewInput,
          rating: typeof ratingInput === "number" ? ratingInput : undefined,
          locale
        })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "failed");
      setReplyText(j.reply || "");
    } catch (e: any) {
      setReplyText(`Error: ${e?.message || "failed"}`);
    } finally {
      setLoadingReply(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <img src="/needai-help_icon.svg" alt="needAI help" width={36} height={36} />
        <h1 style={{ fontSize: 24, margin: 0 }}>BizPilot Dashboard</h1>
        <div style={{ marginLeft: "auto", fontSize: 14, opacity: 0.8 }}>
          {who.loggedIn ? (<>Signed in{who.email ? `: ${who.email}` : ""} • Plan: {who.plan || "free"}</>) : "Not signed in"}
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Generate Post */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Generate Google Business Post</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Locale (language code)
              <input
                value={locale}
                onChange={e => setLocale(e.target.value)}
                placeholder="en, de, fr, sr, es..."
                style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <label>
              Business type (optional)
              <input
                value={bizType}
                onChange={e => setBizType(e.target.value)}
                placeholder="e.g. restaurant, hair salon"
                style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <label>
              Specials/promotions (optional)
              <input
                value={specials}
                onChange={e => setSpecials(e.target.value)}
                placeholder="e.g. -10% today, free delivery"
                style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <button
              onClick={handleGeneratePost}
              disabled={loadingPost}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
            >
              {loadingPost ? "Generating..." : "Generate Post"}
            </button>
            <textarea
              value={postText}
              readOnly
              placeholder="Generated post will appear here..."
              style={{ width: "100%", minHeight: 140, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
          </div>
        </div>

        {/* Reply to Review */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Reply to Customer Review</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Locale (language code)
              <input
                value={locale}
                onChange={e => setLocale(e.target.value)}
                placeholder="en, de, fr, sr, es..."
                style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <label>
              Rating (optional, 1-5)
              <input
                type="number"
                min={1}
                max={5}
                value={ratingInput ?? 5}
                onChange={e => setRatingInput(Number(e.target.value))}
                style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <label>
              Paste customer review
              <textarea
                value={reviewInput}
                onChange={e => setReviewInput(e.target.value)}
                placeholder="Paste the customer's review text here"
                style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </label>
            <button
              onClick={handleGenerateReply}
              disabled={loadingReply}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
            >
              {loadingReply ? "Generating..." : "Generate Reply"}
            </button>
            <textarea
              value={replyText}
              readOnly
              placeholder="AI reply will appear here..."
              style={{ width: "100%", minHeight: 140, padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
          </div>
        </div>
      </section>

      <p style={{ marginTop: 24, fontSize: 13, opacity: 0.7 }}>
        Note: Autopilot is handled by cron + KV. This page is your manual control.
      </p>
    </div>
  );
}

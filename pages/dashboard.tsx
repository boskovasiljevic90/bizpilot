// pages/dashboard.tsx
import { useEffect, useState } from "react";

type Account = { name: string; accountName: string; type?: string; state?: string };
type Location = { name: string; title: string; storeCode?: string; websiteUri?: string; categories?: string };
type Review = {
  name: string;               // "accounts/.../locations/.../reviews/..."
  reviewId?: string;
  starRating?: string;
  comment?: string;
  reviewer?: { displayName?: string };
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiDraft, setAiDraft] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  async function fetchAccounts() {
    setLoading(true);
    try {
      const r = await fetch("/api/gbp/accounts");
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "accounts error");
      setAccounts(j.accounts || []);
    } catch (e) {
      alert("Accounts error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLocations(accName: string) {
    setLoading(true);
    try {
      const r = await fetch(`/api/gbp/locations?account=${encodeURIComponent(accName)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "locations error");
      setLocations(j.locations || []);
    } catch (e) {
      alert("Locations error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews(locName: string) {
    setLoading(true);
    try {
      const r = await fetch(`/api/gbp/reviews?location=${encodeURIComponent(locName)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "reviews error");
      setReviews(j.reviews || []);
    } catch (e) {
      alert("Reviews error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function makeAiReply(review: Review) {
    try {
      const r = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "review-reply",
          businessType: locations.find(l => l.name === selectedLocation)?.categories || "local business",
          reviewText: review.comment || "",
          starRating: review.starRating || "",
          languageHint: "MATCH_REVIEW_LANGUAGE"
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "AI error");
      setReplyText(j.text || "");
    } catch (e) {
      alert("AI reply error: " + (e as Error).message);
    }
  }

  async function sendReply(review: Review) {
    try {
      const text = replyText.trim();
      if (!text) return alert("Empty reply.");
      const r = await fetch("/api/gbp/respondReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: selectedLocation,
          reviewName: review.name,
          replyText: text,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "reply error");
      alert("Reply sent.");
      await fetchReviews(selectedLocation);
      setReplyText("");
    } catch (e) {
      alert("Reply failed: " + (e as Error).message);
    }
  }

  async function makeAiPost() {
    try {
      const r = await fetch("/api/ai/generatePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "post",
          businessType: locations.find(l => l.name === selectedLocation)?.categories || "local business",
          languageHint: "ENGLISH",
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "AI error");
      setAiDraft(j.text || "");
    } catch (e) {
      alert("AI post error: " + (e as Error).message);
    }
  }

  async function updateHoursSimple() {
    const weekdays = prompt("Enter hours (e.g. Mon-Fri 09:00-17:00, Sat 10:00-14:00, Sun closed)");
    if (!weekdays) return;
    try {
      const r = await fetch("/api/gbp/updateHours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: selectedLocation,
          humanHours: weekdays
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "update hours error");
      alert("Hours updated.");
    } catch (e) {
      alert("Update hours failed: " + (e as Error).message);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>BizPilot Dashboard</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Connect account → select location → manage reviews, hours, and AI drafting.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/api/auth/google" style={btn()}>
          Connect Google Business
        </a>
        <button onClick={fetchAccounts} style={btn()} disabled={loading}>Load Accounts</button>

        <select
          value={selectedAccount}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedAccount(v);
            if (v) fetchLocations(v);
          }}
          style={select()}
        >
          <option value="">Select account…</option>
          {accounts.map((a) => (
            <option key={a.name} value={a.name}>
              {a.accountName || a.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedLocation(v);
            if (v) fetchReviews(v);
          }}
          style={select()}
        >
          <option value="">Select location…</option>
          {locations.map((l) => (
            <option key={l.name} value={l.name}>
              {l.title}
            </option>
          ))}
        </select>

        <button onClick={() => selectedLocation ? fetchReviews(selectedLocation) : alert("Select location first")} style={btn()}>
          Refresh Reviews
        </button>

        <button onClick={() => selectedLocation ? updateHoursSimple() : alert("Select location first")} style={btn()}>
          Update Hours (quick)
        </button>
      </div>

      <div style={card()}>
        <h2 style={h2()}>AI Drafts</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <button onClick={() => selectedLocation ? makeAiPost() : alert("Select location first")} style={btn()}>
            Generate Post Idea
          </button>
        </div>
        <textarea
          value={aiDraft}
          onChange={(e) => setAiDraft(e.target.value)}
          placeholder="Post draft will appear here…"
          rows={4}
          style={textarea()}
        />
        <p style={{ fontSize: 12, color: "#777" }}>Note: Posting to GBP posts programmatically may be limited by API access; treat this as a draft.</p>
      </div>

      <div style={card()}>
        <h2 style={h2()}>Reviews</h2>
        {!reviews.length ? (
          <p style={{ color: "#666" }}>No reviews loaded yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.name} style={{ borderTop: "1px solid #eee", paddingTop: 12, marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.reviewer?.displayName || "Anonymous"}</strong>
                <span style={{ color: "#999" }}>{r.starRating || ""}</span>
              </div>
              <p style={{ marginTop: 6 }}>{r.comment || ""}</p>
              {r.reviewReply?.comment ? (
                <p style={{ color: "#2f7a2f" }}>
                  Reply: {r.reviewReply.comment}
                </p>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => makeAiReply(r)} style={btn()}>AI Suggest Reply</button>
                    <button onClick={() => sendReply(r)} style={btn()}>Send Reply</button>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Your reply…"
                    rows={3}
                    style={textarea()}
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function btn() {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  } as React.CSSProperties;
}
function select() {
  return {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    minWidth: 220,
    background: "#fff",
  } as React.CSSProperties;
}
function card() {
  return {
    padding: 16,
    border: "1px solid #eee",
    borderRadius: 12,
    marginBottom: 16,
    background: "#fafafa",
  } as React.CSSProperties;
}
function h2() {
  return { fontSize: 18, fontWeight: 700, marginBottom: 8 } as React.CSSProperties;
}
function textarea() {
  return {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ddd",
    padding: 10,
    marginTop: 10,
    background: "#fff",
    fontFamily: "inherit",
  } as React.CSSProperties;
}

import { useEffect, useState } from "react";
import type { GbpAccount, GbpLocation } from "@/utils/types";

export default function Dashboard() {
  const [status, setStatus] = useState("Checking connection…");
  const [plan, setPlan] = useState<"free"|"pro"|"unknown">("unknown");
  const [email, setEmail] = useState<string|null>(null);
  const [accounts, setAccounts] = useState<GbpAccount[]>([]);
  const [account, setAccount] = useState("");
  const [locations, setLocations] = useState<GbpLocation[]>([]);
  const [location, setLocation] = useState("");
  const [postDraft, setPostDraft] = useState("");
  const [reviewDraft, setReviewDraft] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/whoami").then(r=>r.json());
      if (!me.hasSession) {
        setStatus("Not connected. Connect Google Business first.");
        return;
      }
      setEmail(me.email || null);
      setPlan(me.plan || "free");

      const r = await fetch("/api/gbp/accounts");
      if (r.ok) {
        const d = await r.json();
        setAccounts(d.accounts || []);
        setStatus(d.accounts?.length ? "Connected ✅" : "Connected, but no Accounts");
        if (d.accounts?.[0]?.name) setAccount(d.accounts[0].name);
      } else {
        setStatus(`Connected but fetch failed: ${await r.text()}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!account) return;
      const r = await fetch(`/api/gbp/locations?account=${encodeURIComponent(account)}`);
      if (r.ok) {
        const d = await r.json();
        setLocations(d.locations || []);
        if (d.locations?.[0]?.name) setLocation(d.locations[0].name);
      }
    })();
  }, [account]);

  async function genPost() {
    const title = prompt("Topic / Promo (any language):", "Weekend discount for coffee & pastries");
    if (!title) return;
    const r = await fetch("/api/ai/postDraft", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ title }) });
    const d = await r.json();
    setPostDraft(d.text || d.error || "");
  }

  async function genReply() {
    const review = prompt("Paste a customer review (any language):");
    if (!review) return;
    const r = await fetch("/api/ai/replyDraft", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ review }) });
    const d = await r.json();
    setReviewDraft(d.text || d.error || "");
  }

  async function publish(type: "post" | "reply") {
    if (plan !== "pro") { alert("Pro required. Go to Pricing → Start Trial."); return; }
    if (!location) { alert("Choose location first."); return; }
    const body = type==="post" ? { location, content: postDraft } : { location, content: reviewDraft };
    const r = await fetch(type==="post" ? "/api/gbp/publishPost" : "/api/gbp/publishReply", {
      method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)
    });
    const d = await r.json();
    if (r.ok) alert("Published (or queued) ✅");
    else alert(`Publish failed: ${d.error || r.statusText}`);
  }

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">🤖 BizPilot</div>
        <div style={{display:"flex", gap:12, alignItems:"center"}}>
          <span className="badge">{plan==="pro"?"Pro":"Free"}</span>
          <a className="btn-outline" href="/pricing">Upgrade</a>
          <a className="btn" href="/api/auth/google">Reconnect</a>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="card">
          <h3>Status</h3>
          <p>{status}</p>
          <div className="grid">
            <div>
              <label className="label">Account</label>
              <select className="select" value={account} onChange={(e)=>setAccount(e.target.value)}>
                {accounts.map(a=>(<option key={a.name} value={a.name}>{a.accountName || a.name} ({a.type})</option>))}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <select className="select" value={location} onChange={(e)=>setLocation(e.target.value)}>
                {locations.map(l=>(<option key={l.name} value={l.name}>{l.title || l.name} {l.storeCode?`• ${l.storeCode}`:""}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
            <button className="btn" onClick={genPost}>Generate Post (AI)</button>
            <button className="btn" onClick={genReply}>Generate Review Reply (AI)</button>
          </div>
          <div style={{marginTop:12}} className="notice">
            AI drafts support every language. Edit as you like, then publish (Pro).
          </div>
        </div>

        <div className="card">
          <h3>Post Draft</h3>
          <textarea value={postDraft} onChange={e=>setPostDraft(e.target.value)} rows={10} className="select" placeholder="Click 'Generate Post (AI)'" />
          <div style={{display:"flex", gap:10, marginTop:10}}>
            <button className="btn-outline" onClick={()=>navigator.clipboard.writeText(postDraft)}>Copy</button>
            <button className="btn" onClick={()=>publish("post")}>Publish (Pro)</button>
          </div>
        </div>

        <div className="card">
          <h3>Review Reply Draft</h3>
          <textarea value={reviewDraft} onChange={e=>setReviewDraft(e.target.value)} rows={10} className="select" placeholder="Click 'Generate Review Reply (AI)'" />
          <div style={{display:"flex", gap:10, marginTop:10}}>
            <button className="btn-outline" onClick={()=>navigator.clipboard.writeText(reviewDraft)}>Copy</button>
            <button className="btn" onClick={()=>publish("reply")}>Publish (Pro)</button>
          </div>
        </div>
      </div>
      <div className="footer">Logged in as {email || "unknown"} • © {new Date().getFullYear()} needAI.help</div>
    </div>
  );
}

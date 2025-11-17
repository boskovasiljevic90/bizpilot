// pages/dashboard/index.tsx
import { useEffect, useState } from "react";

type Account = { name: string; accountName: string; type: string };
type Location = { name: string; title: string; storeCode?: string; languageCode?: string };

export default function Dashboard() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("Loading…");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState<string>("");

  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [businessName, setBusinessName] = useState("Your Business");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    async function probe() {
      try {
        const r = await fetch("/api/gbp/accounts");
        if (r.status === 200) {
          const d = await r.json();
          setConnected(true);
          setAccounts(d.accounts || []);
          setStatusMsg(d.accounts?.length ? "Connected ✅" : "Connected, but no Accounts.");
          if (d.accounts?.[0]?.name) setAccount(d.accounts[0].name);
        } else {
          const txt = await r.text();
          setConnected(false);
          setStatusMsg(`Not connected (${r.status}). ${txt.slice(0,200)}`);
        }
      } catch (e:any) {
        setConnected(false);
        setStatusMsg(`Error: ${e?.message || e}`);
      }
    }
    probe();
  }, []);

  useEffect(() => {
    async function loadLocations() {
      if (!account) return;
      try {
        const r = await fetch(`/api/gbp/locations?account=${encodeURIComponent(account)}`);
        if (r.ok) {
          const d = await r.json();
          setLocations(d.locations || []);
          if (d.locations?.[0]?.name) setLocation(d.locations[0].name);
          if (d.locations?.[0]?.title) setBusinessName(d.locations[0].title);
        }
      } catch {}
    }
    loadLocations();
  }, [account]);

  async function generatePost() {
    if (!location || !topic) return alert("Select a location and enter a topic.");
    const r = await fetch("/api/bizpilot/createPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId: location, topic, language })
    });
    alert(await r.text());
  }

  async function generateReply() {
    if (!reviewText) return alert("Paste a review text.");
    const r = await fetch("/api/bizpilot/respondReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewText, businessName, language })
    });
    alert(await r.text());
  }

  async function getInsights() {
    const r = await fetch("/api/bizpilot/analytics");
    alert(await r.text());
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
      <p className="mb-2 text-sm text-gray-600">{statusMsg}</p>
      <p className="mb-8">Poveži Google profil, izaberi nalog i lokaciju, pa koristi AI akcije.</p>

      {connected === false && (
        <div className="mb-10">
          <a className="px-4 py-2 rounded bg-black text-white" href="/api/auth/google">
            Connect Google Business
          </a>
        </div>
      )}

      {connected && (
        <>
          <div className="space-y-4 mb-10">
            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <select className="border p-2 w-full" value={account} onChange={(e) => setAccount(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.accountName || a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select className="border p-2 w-full" value={location} onChange={(e) => setLocation(e.target.value)}>
                {locations.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.title || l.name} {l.storeCode ? `• ${l.storeCode}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <section className="space-y-2 mb-10">
            <h2 className="text-xl font-semibold">Create Post (AI)</h2>
            <input className="border p-2 w-full" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
            <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
            <button className="px-4 py-2 rounded bg-black text-white" onClick={generatePost}>Generate Post</button>
          </section>

          <section className="space-y-2 mb-10">
            <h2 className="text-xl font-semibold">Respond to Review (AI)</h2>
            <input className="border p-2 w-full" placeholder="Business Name" value={businessName} onChange={e=>setBusinessName(e.target.value)} />
            <textarea className="border p-2 w-full" placeholder="Review text" value={reviewText} onChange={e=>setReviewText(e.target.value)} />
            <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
            <button className="px-4 py-2 rounded bg-black text-white" onClick={generateReply}>Generate Reply</button>
          </section>

          <section className="space-y-2 mb-10">
            <h2 className="text-xl font-semibold">Analytics (AI insights)</h2>
            <button className="px-4 py-2 rounded bg-black text-white" onClick={getInsights}>Get Insights</button>
          </section>
        </>
      )}
    </div>
  );
}

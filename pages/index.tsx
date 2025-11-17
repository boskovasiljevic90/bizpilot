import { useEffect, useState } from "react";

type Account = { name: string; accountName: string; type: string };
type Location = { name: string; title: string; storeCode?: string; languageCode?: string };

export default function Dashboard() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState<string>("");

  // AI inputs
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [businessName, setBusinessName] = useState("Your Business");
  const [reviewText, setReviewText] = useState("");

  // 1) proveri da li imamo cookie sa tokenima (grubo; od servera bolje, ali za MVP ok)
  useEffect(() => {
    // Ako ima bilo kakvih cookies, pokušaćemo da učitamo naloge.
    // U suprotnom nudimo "Connect Google".
    const hasCookies = document.cookie.includes("gbp_tokens=");
    setConnected(hasCookies ? true : false);
  }, []);

  // 2) ako smo povezani, povuci accounts
  useEffect(() => {
    if (connected) {
      fetch("/api/gbp/accounts")
        .then(r => r.json())
        .then(d => {
          if (d?.accounts) {
            setAccounts(d.accounts);
            if (d.accounts[0]?.name) setAccount(d.accounts[0].name);
          }
        })
        .catch(() => {});
    }
  }, [connected]);

  // 3) kad se izabere account, povuci locations
  useEffect(() => {
    if (account) {
      fetch(`/api/gbp/locations?account=${encodeURIComponent(account)}`)
        .then(r => r.json())
        .then(d => {
          if (d?.locations) {
            setLocations(d.locations);
            if (d.locations[0]?.name) setLocation(d.locations[0].name);
            if (d.locations[0]?.title) setBusinessName(d.locations[0].title);
          }
        })
        .catch(() => {});
    }
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
      <p className="mb-8">Poveži Google profil, izaberi nalog i lokaciju, pa koristi AI akcije.</p>

      {/* CONNECT */}
      {connected === false && (
        <div className="mb-10">
          <a className="px-4 py-2 rounded bg-black text-white" href="/api/auth/google">Connect Google Business</a>
        </div>
      )}

      {/* ACCOUNT & LOCATION */}
      {connected && (
        <div className="space-y-4 mb-10">
          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              className="border p-2 w-full"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              {accounts.map(a => (
                <option key={a.name} value={a.name}>
                  {a.accountName || a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              className="border p-2 w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map(l => (
                <option key={l.name} value={l.name}>
                  {l.title || l.name} {l.storeCode ? `• ${l.storeCode}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* AI: CREATE POST */}
      {connected && (
        <section className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold">Create Post (AI)</h2>
          <input className="border p-2 w-full" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
          <button className="px-4 py-2 rounded bg-black text-white" onClick={generatePost}>Generate Post</button>
        </section>
      )}

      {/* AI: RESPOND REVIEW */}
      {connected && (
        <section className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold">Respond to Review (AI)</h2>
          <input className="border p-2 w-full" placeholder="Business Name" value={businessName} onChange={e=>setBusinessName(e.target.value)} />
          <textarea className="border p-2 w-full" placeholder="Review text" value={reviewText} onChange={e=>setReviewText(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
          <button className="px-4 py-2 rounded bg-black text-white" onClick={generateReply}>Generate Reply</button>
        </section>
      )}

      {/* AI: ANALYTICS */}
      {connected && (
        <section className="space-y-2 mb-10">
          <h2 className="text-xl font-semibold">Analytics (AI insights)</h2>
          <button className="px-4 py-2 rounded bg-black text-white" onClick={getInsights}>Get Insights</button>
        </section>
      )}
    </div>
  );
}

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

  // 1) DETEKCIJA POVEZANOSTI: ne čitamo cookie (httpOnly) — pitamo server
  useEffect(() => {
    async function probe() {
      try {
        const r = await fetch("/api/gbp/accounts");
        if (r.status === 200) {
          const d = await r.json();
          setConnected(true);
          setAccounts(d.accounts || []);
          if (d.accounts?.[0]?.name) setAccount(d.accounts[0].name);
        } else {
          setConnected(false);
        }
      } catch {
        setConnected(false);
      }
    }
    probe();
  }, []);

  // 2) Kad odaberemo account, povuci locations
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
      <p className="mb-8">Poveži Google profil, izaberi nalog i lokaciju, pa koristi AI akcije.</p>

      {/* CONNECT / STATUS */}
      {connected === null && <p>Loading…</p>}
      {connected === false && (
        <div className="mb-10">
          <a className="px-4 py-2 rounded bg-black text-white" href="/api/auth/google">
            Connect Google Business
          </a>
          <p className="text-sm text-gray-500 mt-2">
            (Ako si upravo verifikovao GBP, klikni Connect da obnoviš dozvole.)
          </p>
        </div>
      )}

      {/* ACCOUNT & LOCATION */}
      {connected && (
        <>
          <div className="space-y-4 mb-10">
            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <select
                className="border p-2 w-full"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.accountName || a.name} ({a.type})
                  </option>
                ))}
              </select>
              {accounts.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Nema dostupnih naloga. Uveri se da je tvoj Gmail Owner/Manager na Business Profile-u.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select

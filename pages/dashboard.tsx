// pages/dashboard.tsx
import { useEffect, useState } from "react";

type Opt = { value: string; label: string };

export default function Dashboard() {
  const [status, setStatus] = useState<string>("Ready");
  const [diag, setDiag] = useState<any>(null);

  const [accounts, setAccounts] = useState<Opt[]>([]);
  const [account, setAccount] = useState<string>("");

  const [locations, setLocations] = useState<Opt[]>([]);
  const [location, setLocation] = useState<string>("");

  async function callJSON(url: string) {
    setStatus(`Calling ${url} ...`);
    const r = await fetch(url);
    const js = await r.json().catch(() => ({}));
    setDiag({ url, status: r.status, payload: js });
    return { ok: r.ok, js };
  }

  async function onConnect() {
    window.location.href = "/api/auth/google";
  }

  async function onLoadAccounts() {
    const { ok, js } = await callJSON("/api/gbp/accounts");
    if (!ok) return;
    if (!js?.accounts?.length) {
      setStatus("No accounts returned");
      setAccounts([]);
      setAccount("");
      return;
    }
    const opts = js.accounts.map((a: any) => ({
      value: a.name, // "accounts/XXXX"
      label: a.accountName || a.name,
    }));
    setAccounts(opts);
    setAccount(opts[0].value);
    setStatus(`Loaded ${opts.length} account(s)`);
  }

  async function onLoadLocations() {
    if (!account) {
      setStatus("Select account first");
      return;
    }
    const { ok, js } = await callJSON(`/api/gbp/locations?account=${encodeURIComponent(account)}`);
    if (!ok) return;
    const opts = (js.locations || []).map((l: any) => ({
      value: l.name, // "locations/XXXX"
      label: l.title || l.name,
    }));
    setLocations(opts);
    setLocation(opts[0]?.value || "");
    setStatus(`Loaded ${opts.length} location(s)`);
  }

  // maleni helper da se odmah vidi ko je ulogovan
  async function checkWho() {
    const r = await fetch("/api/auth/whoami");
    const js = await r.json().catch(() => ({}));
    setDiag((d: any) => ({ ...(d || {}), whoami: js }));
  }

  useEffect(() => {
    checkWho();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto", fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>BizPilot Dashboard</h1>
      <p style={{ marginBottom: 16, color: "#555" }}>
        Connect → Load Accounts → Select Account → Load Locations → Select Location
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <button onClick={onConnect} style={btn}>Connect Google Business</button>
        <button onClick={onLoadAccounts} style={btn}>Load Accounts</button>
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          style={inp}
        >
          <option value="">Select account…</option>
          {accounts.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
        <button onClick={onLoadLocations} style={btn}>Load Locations</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div>
          <label style={lbl}>Account</label>
          <select value={account} onChange={(e) => setAccount(e.target.value)} style={inp}>
            <option value="">Select account…</option>
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={inp}>
            <option value="">Select location…</option>
            {locations.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: "#444" }}>
        <b>Status:</b> {status}
      </div>

      <div>
        <label style={lbl}>Diagnostics (raw JSON)</label>
        <textarea
          readOnly
          value={JSON.stringify(diag ?? {}, null, 2)}
          style={{ width: "100%", height: 300, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "black",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 600,
};

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "white",
};

const lbl: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 600 };

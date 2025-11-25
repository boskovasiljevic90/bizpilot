import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="nav">
        <div className="brand">🤖 BizPilot <span className="badge">needAI.help</span></div>
        <div style={{display:"flex", gap:12}}>
          <Link className="btn-outline" href="/pricing">Pricing</Link>
          <a className="btn" href="/api/auth/google">Connect Google Business</a>
        </div>
      </div>

      <div className="hero">
        <div className="card">
          <h1 className="h1">Your AI Google Business Manager.</h1>
          <p className="sub">Automate posts, craft replies, and optimize your profile in any language. Free plan to try. Pro is just €30/month with 14-day trial.</p>
          <div style={{display:"flex", gap:12}}>
            <a className="btn" href="/api/auth/google">Start Free</a>
            <Link className="btn-outline" href="/dashboard">Open Dashboard</Link>
          </div>
          <div className="kv">
            <div>🌍 All languages</div><div>🛡️ Privacy-first</div>
            <div>⚡ Quick setup</div><div>🧠 AI-generated content</div>
          </div>
        </div>
        <div className="card">
          <h3>What it does</h3>
          <table className="table">
            <tbody>
              <tr><td>Connect Google Business</td><td>✓</td></tr>
              <tr><td>List accounts & locations</td><td>✓</td></tr>
              <tr><td>AI post generator (draft)</td><td>✓ Free</td></tr>
              <tr><td>AI review replies (draft)</td><td>✓ Free</td></tr>
              <tr><td>1-click publish</td><td>Pro</td></tr>
            </tbody>
          </table>
          <p className="notice">Note: Direct publishing requires Google API access approvals. Drafts are available instantly.</p>
        </div>
      </div>
      <div className="footer">© {new Date().getFullYear()} needAI.help — BizPilot</div>
    </div>
  );
}

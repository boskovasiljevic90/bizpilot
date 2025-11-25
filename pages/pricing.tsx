import Link from "next/link";

export default function Pricing() {
  return (
    <div className="container">
      <div className="nav">
        <div className="brand">🤖 BizPilot</div>
        <Link className="btn-outline" href="/">Home</Link>
      </div>

      <h1 className="h1">Pricing</h1>
      <div className="pricing">
        <div className="card">
          <h3>Free</h3>
          <div className="price">€0</div>
          <ul>
            <li>Connect Google Business</li>
            <li>List accounts & locations</li>
            <li>AI drafts (posts & replies)</li>
          </ul>
          <a className="btn-outline" href="/api/auth/google">Start Free</a>
        </div>
        <div className="card">
          <h3>Pro</h3>
          <div className="price">€30<span style={{fontSize:14}}>/mo</span></div>
          <ul>
            <li>Everything in Free</li>
            <li>14-day free trial</li>
            <li>1-click publish (where available)</li>
            <li>Priority support</li>
          </ul>
          <a className="btn" href="/api/stripe/createCheckout">Start Trial</a>
        </div>
      </div>
    </div>
  );
}

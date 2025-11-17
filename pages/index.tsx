import { useState } from "react";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [locationId, setLocationId] = useState("TEST");
  const [reviewText, setReviewText] = useState("");
  const [businessName, setBusinessName] = useState("Your Business");
  const [priceId, setPriceId] = useState(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM || "");

  async function callCreatePost() {
    const r = await fetch("/api/bizpilot/createPost", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId, topic, language })
    });
    alert(await r.text());
  }

  async function callRespondReview() {
    const r = await fetch("/api/bizpilot/respondReview", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewText, businessName, language })
    });
    alert(await r.text());
  }

  async function callAnalytics() {
    const r = await fetch("/api/bizpilot/analytics");
    alert(await r.text());
  }

  async function upgrade() {
    const r = await fetch("/api/stripe/createCheckoutSession", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM })
    });
    const { url } = await r.json();
    window.location.href = url;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">BizPilot Dashboard (MVP)</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Connect</h2>
        <a className="px-4 py-2 rounded bg-black text-white inline-block" href="/api/auth/google">Connect Google Business</a>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Create Post (AI)</h2>
        <input className="border p-2 w-full" placeholder="Location ID" value={locationId} onChange={e=>setLocationId(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={callCreatePost}>Generate Post</button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Respond to Review (AI)</h2>
        <input className="border p-2 w-full" placeholder="Business Name" value={businessName} onChange={e=>setBusinessName(e.target.value)} />
        <textarea className="border p-2 w-full" placeholder="Review text" value={reviewText} onChange={e=>setReviewText(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Language" value={language} onChange={e=>setLanguage(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={callRespondReview}>Generate Reply</button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Analytics (AI insights)</h2>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={callAnalytics}>Get Insights</button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Subscription</h2>
        <input className="border p-2 w-full" placeholder="Stripe Price ID" value={priceId} onChange={e=>setPriceId(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={upgrade}>Upgrade to Premium</button>
      </section>
    </div>
  );
}

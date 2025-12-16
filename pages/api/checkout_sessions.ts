import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const url = envUrl || vercelUrl;
  if (!url) throw new Error("Base URL missing. Set NEXT_PUBLIC_SITE_URL or VERCEL_URL.");
  if (!/^https?:\/\//i.test(url)) throw new Error("NEXT_PUBLIC_SITE_URL must include scheme, e.g. https://needai.help");
  return url.replace(/\/+$/, "");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const base = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      success_url: `${base}/success`,
      cancel_url: `${base}/pricing`,
    });
    res.redirect(303, session.url as string);
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
}

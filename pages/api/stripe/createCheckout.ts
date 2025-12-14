// pages/api/stripe/createCheckout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    const sk = (process.env.STRIPE_SECRET_KEY || "").trim();
    const priceId = (process.env.STRIPE_PRICE_ID || "").trim();

    if (!sk || !priceId) {
      return res.status(500).json({
        error: "Missing Stripe env",
        need: { STRIPE_SECRET_KEY: !sk, STRIPE_PRICE_ID: !priceId },
      });
    }

    const stripe = new Stripe(sk, { apiVersion: "2023-10-16" });

    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host!;
    const base = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;

    const s = await session(req, res);
    const customerEmail = s.email || undefined;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/dashboard?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancel`,
      customer_email: customerEmail,
      subscription_data: {
        trial_period_days: 14,
      },
    });

    return res.redirect(303, checkout.url!);
  } catch (e: any) {
    return res.status(500).json({
      error: "stripe/createCheckout crashed",
      message: e?.message || String(e),
    });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      return res.status(500).json({
        error: "Missing Stripe env",
        need: {
          STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
          STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
        },
      });
    }

    const s = await session(req, res);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const email = s.email || undefined;

    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host!;
    const success = `${proto}://${host}/dashboard`;
    const cancel = `${proto}://${host}/pricing`;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: success,
      cancel_url: cancel,
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
    });

    res.redirect(303, checkout.url!);
  } catch (e:any) {
    res.status(500).json({ error: "stripe/createCheckout crashed", message: e?.message || String(e) });
  }
}

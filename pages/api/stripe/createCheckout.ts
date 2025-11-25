import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");
  const s = await session(req, res);

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.status(500).send("Stripe not configured");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  const email = s.email || undefined;

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/dashboard`,
    cancel_url: `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/pricing`,
    customer_email: email,
    line_items: [ { price: process.env.STRIPE_PRICE_ID, quantity: 1 } ],
    allow_promotion_codes: true
  });

  res.redirect(303, checkout.url!);
}

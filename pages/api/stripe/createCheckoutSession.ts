import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { priceId } = req.body; // PASSUJ iz fronta: PREMIUM price
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${req.headers.origin}/dashboard?success=1`,
    cancel_url: `${req.headers.origin}/dashboard?canceled=1`
  });
  return res.status(200).json({ url: session.url });
}

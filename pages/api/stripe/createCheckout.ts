// pages/api/stripe/createCheckout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    const sk = process.env.STRIPE_SECRET_KEY || "";
    const priceId = process.env.STRIPE_PRICE_ID || "";

    if (!sk || !priceId) {
      return res.status(500).json({
        error: "Missing Stripe env",
        need: {
          STRIPE_SECRET_KEY: !!sk,
          STRIPE_PRICE_ID: !!priceId,
        },
      });
    }

    const s = await session(req, res);
    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host!;
    const successUrl = `${proto}://${host}/dashboard?checkout=success`;
    const cancelUrl = `${proto}://${host}/pricing?checkout=cancel`;

    // >>> OVDE DIREKTNO POSTAVLJAMO 14-DNEVNI TRIAL <<<
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: s.email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,      // <-- ovo obezbeđuje trial bez potrebe da je na cenu upisan
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

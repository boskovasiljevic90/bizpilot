// pages/api/stripe/createCheckout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    const sk = (process.env.STRIPE_SECRET_KEY || "").trim();
    const configured = (process.env.STRIPE_PRICE_ID || "").trim();

    if (!sk || !configured) {
      return res.status(500).json({
        error: "Missing Stripe env",
        need: {
          STRIPE_SECRET_KEY: !!sk,
          STRIPE_PRICE_ID: !!configured,
        },
      });
    }

    // >>> KLJUČNA PROMENA: uklonjen apiVersion da bi radio sa tvojom instaliranom verzijom stripe paketa
    const stripe = new Stripe(sk);

    // Prihvati i prod_ i price_; ako je prod_, prevede u price
    let priceId = configured;
    if (configured.startsWith("prod_")) {
      const product = await stripe.products.retrieve(configured, { expand: ["default_price"] });
      const dp = product.default_price;
      if (!dp) {
        return res.status(400).json({
          error: "Product has no default price",
          hint: "U Stripe dodaj recurring €29.99/month price i koristi njegov price_... ID.",
        });
      }
      priceId = typeof dp === "string" ? dp : dp.id;
    } else if (!configured.startsWith("price_")) {
      return res.status(400).json({
        error: "Invalid STRIPE_PRICE_ID format",
        got: configured,
        hint: "Mora počinjati sa price_... (ili prod_... ako koristiš auto-resolve).",
      });
    }

    const s = await session(req, res);
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host!;
    const successUrl = `${proto}://${host}/dashboard?checkout=success`;
    const cancelUrl  = `${proto}://${host}/pricing?checkout=cancel`;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: s.email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14, // 14 dana trial direktno iz koda
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

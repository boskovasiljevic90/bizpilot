// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "node:stream/consumers";

// VAŽNO: za Stripe webhook Next mora da isporuči raw body
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing stripe-signature");

  try {
    // Stripe klijent BEZ apiVersion override-a (koristi verziju iz paketa)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const buf = await buffer(req);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, secret);
    } catch (err: any) {
      return res.status(400).send(`Webhook signature verification failed: ${err?.message || String(err)}`);
    }

    // Ovde obradi relevantne evente po potrebi
    switch (event.type) {
      case "checkout.session.completed":
        // const session = event.data.object as Stripe.Checkout.Session;
        // TODO: upis u bazu / KV da je plan = "pro" za datog korisnika (po customer_email)
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // TODO: sync status pretplate
        break;
      default:
        // Ostale događaje za sada ignorišemo
        break;
    }

    return res.status(200).json({ received: true });
  } catch (e: any) {
    return res.status(500).json({
      error: "stripe/webhook crashed",
      message: e?.message || String(e),
    });
  }
}

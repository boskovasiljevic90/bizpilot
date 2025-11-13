import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // TODO: na osnovu eventa (checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated)
  // postavi cookie plan=trial/premium ili snimi u DB. MVP: plan u cookie (oprezno).
  // res.setHeader("Set-Cookie", serialize("plan","premium", { ... }));
  res.json({ received: true });
}

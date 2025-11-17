import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

function setPlanCookie(res: NextApiResponse, plan: "freemium" | "trial" | "premium") {
  res.setHeader("Set-Cookie", serialize("plan", plan, {
    httpOnly: false, // UI treba da vidi plan; za produkciju pređi na DB/session
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }));
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

  // Na checkout.session.completed: korisnik je pokrenuo trial (pošto je price ima 14d trial)
  if (event.type === "checkout.session.completed") {
    setPlanCookie(res, "trial");
    return res.json({ ok: true });
  }

  // Kada prva naplata prođe ili subscription postane active -> premium
  if (event.type === "invoice.payment_succeeded" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription | any;
    if (sub?.status === "active" || sub?.status === "trialing") {
      setPlanCookie(res, sub.status === "trialing" ? "trial" : "premium");
      return res.json({ ok: true });
    }
  }

  // Ako otkaže ili istekne
  if (event.type === "customer.subscription.deleted") {
    setPlanCookie(res, "freemium");
    return res.json({ ok: true });
  }

  return res.json({ received: true });
}

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

function buffer(req: NextApiRequest): Promise<Buffer> {
  // @ts-ignore
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on("data", (d: any) => chunks.push(d));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Missing stripe-signature");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
  const buf = await buffer(req);

  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(buf, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (e:any) {
    return res.status(400).send(`Webhook error: ${e.message}`);
  }

  // We won't persist user data; client checks subscription by querying Stripe on /whoami
  // Here we could implement emailing or logging if needed.
  res.json({ received: true, type: evt.type });
}

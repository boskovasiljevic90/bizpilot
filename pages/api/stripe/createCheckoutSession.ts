import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-01" });

export default async function handler(req, res) {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.headers.origin}/dashboard?success=true`,
    cancel_url: `${req.headers.origin}/dashboard?canceled=true`,
  });

  res.status(200).json({ url: session.url });
}
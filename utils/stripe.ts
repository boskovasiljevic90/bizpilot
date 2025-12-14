// utils/stripe.ts
import Stripe from "stripe";

// Klijent bez apiVersion override-a (koristi paketovu verziju)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/** Opcionalno: brz sanity-check env varijabli za Stripe */
export function checkStripeEnv() {
  return {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
  };
}

/** Vrati prvog kupca sa tim email-om (ako postoji) */
export async function getCustomerByEmail(email: string) {
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] || null;
}

/** Osiguraj da postoji Customer (kreiraj ako ne postoji) */
export async function ensureCustomer(email?: string | null) {
  if (!email) return null;
  const existing = await getCustomerByEmail(email);
  if (existing) return existing;
  return stripe.customers.create({ email });
}

/** Uzmi aktivnu (ili trial) pretplatu za kupca — ako ti zatreba */
export async function getActiveSubscriptionByCustomer(customerId: string) {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
    expand: ["data.default_payment_method"],
  });
  return subs.data.find(s =>
    ["trialing", "active", "past_due", "unpaid"].includes(s.status)
  ) || null;
}

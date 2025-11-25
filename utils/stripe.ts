import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export async function getCustomerByEmail(email: string) {
  const list = await stripe.customers.list({ email, limit: 1 });
  return list.data[0] || null;
}

export async function ensureCustomer(email: string) {
  const existing = await getCustomerByEmail(email);
  if (existing) return existing;
  return stripe.customers.create({ email });
}

export async function getActiveSubscriptionStatus(email: string): Promise<{ active: boolean; current_period_end?: number | null }> {
  const customer = await getCustomerByEmail(email);
  if (!customer) return { active: false };
  const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 3 });
  const sub = subs.data.find(s => ["active", "trialing", "past_due"].includes(s.status));
  return { active: !!sub, current_period_end: sub?.current_period_end || null };
}

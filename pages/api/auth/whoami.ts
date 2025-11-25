import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { getActiveSubscriptionStatus } from "@/utils/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  let plan = s.plan || "free";

  if (s.email && process.env.STRIPE_SECRET_KEY) {
    try {
      const sub = await getActiveSubscriptionStatus(s.email);
      if (sub.active) plan = "pro";
    } catch {}
  }

  s.plan = plan;
  await s.save();

  const t = s.tokens;
  res.status(200).json({
    hasSession: !!t,
    email: s.email || null,
    plan,
    tokenKeys: t ? Object.keys(t) : [],
    scope: t?.scope || null
  });
}

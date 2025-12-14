// pages/api/auth/whoami.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { getActiveSubscriptionStatus, checkStripeEnv } from "@/utils/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s = await session(req, res);

    const stripeEnv = checkStripeEnv();
    const subStatus = await getActiveSubscriptionStatus(s.email || null);

    res.status(200).json({
      ok: true,
      session: {
        email: s.email || null,
        plan: s.plan || null,
        hasTokens: !!s.tokens,
      },
      stripe: {
        env: stripeEnv,
        subscriptionStatus: subStatus, // npr. "trialing", "active", null...
      },
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e?.message || String(e),
    });
  }
}

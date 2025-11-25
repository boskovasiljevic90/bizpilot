import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  const checks = {
    env: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      SESSION_SECRET_len: (process.env.SESSION_SECRET || "").length
    },
    session: {
      hasTokens: !!s.tokens,
      email: s.email || null,
      plan: s.plan || null
    }
  };
  const errors: string[] = [];
  if (!checks.env.GOOGLE_CLIENT_ID) errors.push("Missing GOOGLE_CLIENT_ID");
  if (!checks.env.GOOGLE_CLIENT_SECRET) errors.push("Missing GOOGLE_CLIENT_SECRET");
  if (!checks.env.OPENAI_API_KEY) errors.push("Missing OPENAI_API_KEY");
  if (!checks.env.STRIPE_SECRET_KEY) errors.push("Missing STRIPE_SECRET_KEY");
  if (!checks.env.STRIPE_PRICE_ID) errors.push("Missing STRIPE_PRICE_ID");
  if (!checks.env.STRIPE_WEBHOOK_SECRET) errors.push("Missing STRIPE_WEBHOOK_SECRET");
  if (checks.env.SESSION_SECRET_len < 32) errors.push("SESSION_SECRET too short");
  res.status(errors.length?400:200).json({ ok: errors.length===0, checks, errors });
}

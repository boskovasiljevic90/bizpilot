// pages/api/_debug/selftest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s = await session(req, res);
    return res.status(200).json({
      ok: true,
      email: s.email ?? null,
      plan: s.plan ?? "free",
      hasTokens: !!s.tokens
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "selftest failed" });
  }
}

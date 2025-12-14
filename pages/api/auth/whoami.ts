// pages/api/auth/whoami.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s = await session(req, res);
    res.status(200).json({ loggedIn: !!s.email, email: s.email || null, plan: s.plan || "free" });
  } catch (e: any) {
    res.status(200).json({ loggedIn: false, email: null, plan: "free", note: e?.message || null });
  }
}

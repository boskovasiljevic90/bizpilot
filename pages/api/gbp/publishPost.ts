import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  if (s.plan !== "pro") return res.status(402).json({ error: "Pro plan required" });
  // Placeholder: Implement actual Google Local Posts publish if your project has access.
  // For now, just echo success to unblock UI.
  const { location, content } = req.body || {};
  if (!location || !content) return res.status(400).json({ error: "Missing location or content" });
  return res.status(200).json({ ok: true, location });
}

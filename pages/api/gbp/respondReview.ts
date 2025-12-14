// pages/api/gbp/respondReview.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { location, reviewName, replyText } = req.body || {};
    if (!location || !reviewName || !replyText) {
      return res.status(400).json({ error: "Missing location/reviewName/replyText" });
    }

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) return res.status(401).json({ error: "Not connected to Google Business" });

    const auth = fromSession(tokens);
    const url = `https://mybusiness.googleapis.com/v4/${encodeURIComponent(reviewName)}/reply`; // POST body: { comment }
    const { data }: any = await (auth as any).request({
      url,
      method: "PUT",
      data: { comment: replyText },
    });

    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ error: "respondReview failed", message: e?.message || String(e) });
  }
}

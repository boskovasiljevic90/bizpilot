// pages/api/gbp/reviews.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const { location } = req.query;
    if (!location || typeof location !== "string") {
      return res.status(400).json({ error: "Missing ?location=locations/XXXXXXXX" });
    }

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) return res.status(401).json({ error: "Not connected to Google Business" });

    const auth = fromSession(tokens);
    // Business Profile Reviews API
    const url = `https://mybusiness.googleapis.com/v4/${encodeURIComponent(location)}/reviews`;
    const { data }: any = await (auth as any).request({ url, method: "GET" });

    const reviews = (data?.reviews || []).map((r: any) => ({
      name: r.name, // "locations/.../reviews/..."
      reviewId: r.reviewId,
      starRating: r.starRating,
      comment: r.comment,
      reviewer: r.reviewer,
      createTime: r.createTime,
      updateTime: r.updateTime,
      reviewReply: r.reviewReply,
    }));

    return res.status(200).json({ ok: true, reviews });
  } catch (e: any) {
    return res.status(500).json({ error: "reviews failed", message: e?.message || String(e) });
  }
}

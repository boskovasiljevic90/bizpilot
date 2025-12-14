// pages/api/gbp/locations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { account } = req.query;
    if (!account || typeof account !== "string") {
      return res.status(400).json({ error: "Missing ?account=accounts/XXXX" });
    }

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) {
      return res.status(401).json({ error: "Not connected to Google Business" });
    }

    const auth = fromSession(tokens);
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodeURIComponent(account)}/locations`;
    const { data }: any = await (auth as any).request({ url, method: "GET" });

    const locations = (data?.locations || []).map((l: any) => ({
      name: l.name,             // "locations/1234567890"
      title: l.title,
      storeCode: l.storeCode,
      websiteUri: l.websiteUri,
      categories: l.primaryCategory?.displayName,
    }));

    return res.status(200).json({ ok: true, locations });
  } catch (e: any) {
    return res.status(500).json({ error: "locations failed", message: e?.message || String(e) });
  }
}

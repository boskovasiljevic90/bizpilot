// pages/api/gbp/locations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

/**
 * Lokacije čitamo iz Business Information API (v1)
 * GET https://mybusinessbusinessinformation.googleapis.com/v1/{account}/locations?readMask=...
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const account = req.query.account;
    if (!account || typeof account !== "string") {
      return res.status(400).json({ error: "Missing ?account=accounts/XXXXXXXX" });
    }

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) {
      return res.status(401).json({ error: "Not connected to Google Business" });
    }

    const auth = fromSession(tokens);
    const readMask = [
      "name",
      "title",
      "storeCode",
      "websiteUri",
      "categories",
    ].join(",");

    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodeURIComponent(
      account
    )}/locations?readMask=${encodeURIComponent(readMask)}`;

    try {
      const { data }: any = await (auth as any).request({ url, method: "GET" });
      const locations = (data?.locations || []).map((l: any) => ({
        name: l.name, // "locations/XXXX"
        title: l.title,
        storeCode: l.storeCode,
        websiteUri: l.websiteUri,
        categories: l.categories?.primaryCategory?.displayName || l.categories?.primaryCategory?.name,
      }));
      return res.status(200).json({ ok: true, locations, rawCount: locations.length });
    } catch (e: any) {
      return res.status(502).json({
        error: "locations failed",
        details: e?.response?.data || e?.message || String(e),
        hint:
          "Proveri da li je uključen Business Profile API i da OAuth ima scope business.manage. Takođe, nalog mora imati lokacije.",
      });
    }
  } catch (e: any) {
    return res.status(500).json({ error: "locations crashed", message: e?.message || String(e) });
  }
}

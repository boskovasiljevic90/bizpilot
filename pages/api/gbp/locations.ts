import type { NextApiRequest, NextApiResponse } from "next";
import { getTokensFromCookie, getOAuthClient, gRequest } from "@/utils/googleRequest";

/**
 * GET /api/gbp/locations?account=accounts/XXXXXXXX
 * Vraća lokacije za dati nalog.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).end();
    const { account } = req.query as { account?: string };
    if (!account) return res.status(400).json({ error: "Missing 'account' query param (e.g. accounts/123...)" });

    const tokens = getTokensFromCookie(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

    const oauth = getOAuthClient(tokens);
    // Business Information API — list locations za dati account
    // readMask: biramo polja koja su nam korisna za prikaz
    const params = new URLSearchParams({
      readMask: "name,title,storeCode,languageCode,profile,metadata",
      // pageSize: "100" // ako želiš više
    });
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodeURIComponent(account)}/locations?${params.toString()}`;
    const data = await gRequest(oauth, url, "GET");

    const locations = (data?.locations || []).map((l: any) => ({
      name: l.name,               // "locations/XXXXXXXX"
      title: l.title,
      storeCode: l.storeCode,
      languageCode: l.languageCode
    }));

    return res.status(200).json({ locations });
  } catch (e: any) {
    console.error("gbp/locations error:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch locations", detail: String(e?.message || e) });
  }
}

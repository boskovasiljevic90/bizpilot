import type { NextApiRequest, NextApiResponse } from "next";
import { getTokensFromCookie, getOAuthClient, gRequest } from "@/utils/googleRequest";

/**
 * GET /api/gbp/accounts
 * Vraća listu naloga (accounts) za povezanog korisnika.
 * Korišćenje: GET bez parametara.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).end();
    const tokens = getTokensFromCookie(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

    const oauth = getOAuthClient(tokens);
    // Business Account Management API
    const url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";
    const data = await gRequest(oauth, url, "GET");

    // Normalizuj rezultat
    const accounts = (data?.accounts || []).map((a: any) => ({
      name: a.name, // "accounts/1234567890"
      accountName: a.accountName,
      type: a.type
    }));

    return res.status(200).json({ accounts });
  } catch (e: any) {
    console.error("gbp/accounts error:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch accounts", detail: String(e?.message || e) });
  }
}

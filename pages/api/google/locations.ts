import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { gfetch } from "@/lib/google";

/**
 * Koristi Business Profile API v1:
 * - Accounts:  https://mybusinessaccountmanagement.googleapis.com/v1/accounts
 * - Locations: https://mybusinessbusinessinformation.googleapis.com/v1/{accountName}/locations?readMask=...
 *
 * Scopes: https://www.googleapis.com/auth/business.manage  (već koristimo u NextAuth)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    // 1) Učitaj naloge (Account Management API)
    const accountsResp = await gfetch<{ accounts?: { name: string; accountName?: string }[] }>(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      accessToken
    );
    const accounts = accountsResp.accounts ?? [];

    if (accounts.length === 0) {
      return res.json({
        locations: [],
        diag: {
          accounts: 0,
          locations: 0,
          hint:
            "No Business Profile accounts. Ensure your Google user is Owner/Manager of at least one verified location and both Business Profile APIs are enabled for this project.",
        },
      });
    }

    // 2) Za svaki nalog, listaj lokacije (Business Information API)
    const all: any[] = [];
    for (const acc of accounts) {
      // acc.name je oblika "accounts/123456789"
      const parent = acc.name.startsWith("accounts/") ? acc.name : `accounts/${acc.name}`;
      const readMask = [
        "name",
        "title",
        "websiteUri",
        "storefrontAddress",
        "phoneNumbers",
        "regularHours",
        "primaryCategory",
      ].join(",");

      const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${parent}/locations?readMask=${encodeURIComponent(
        readMask
      )}`;

      const locs = await gfetch<{ locations?: any[] }>(url, accessToken);
      for (const loc of locs.locations ?? []) {
        all.push({ account: parent, location: loc });
      }
    }

    res.json({ locations: all, diag: { accounts: accounts.length, locations: all.length } });
  } catch (e: any) {
    console.error("GBP locations error:", e?.message || e);
    res.status(500).json({
      error: e?.message || "Unknown error from Google API",
      hint:
        "Make sure BOTH APIs are enabled: Business Profile Account Management API and Business Profile Business Information API.",
    });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { gfetch } from "@/lib/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    // 1) Accounts (Business Profile API v4)
    const accounts = await gfetch<{ accounts?: { name: string }[] }>(
      "https://mybusiness.googleapis.com/v4/accounts",
      accessToken
    );
    const accs = accounts.accounts ?? [];

    // Ako nema ni jedan nalog -> vrati prazno sa objašnjenjem
    if (accs.length === 0) {
      return res.json({
        locations: [],
        diag: {
          accounts: 0,
          hint: "No Business Profile accounts found. Ensure your Google account owns/manages at least one verified location and that the Business Profile API is enabled for your OAuth project.",
        },
      });
    }

    // 2) Locations per account
    const all: any[] = [];
    for (const acc of accs) {
      const locs = await gfetch<{ locations?: any[] }>(
        `https://mybusiness.googleapis.com/v4/${acc.name}/locations`,
        accessToken
      );
      (locs.locations ?? []).forEach((l) => all.push({ account: acc.name, location: l }));
    }

    res.json({ locations: all, diag: { accounts: accs.length, locations: all.length } });
  } catch (e: any) {
    console.error("GBP locations error:", e?.message || e);
    // Propusti originalni tekst greške do klijenta
    res.status(500).json({ error: e?.message || "Unknown error from Google API" });
  }
}

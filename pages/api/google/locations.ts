import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { gfetch } from "@/lib/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    const accounts = await gfetch<{ accounts?: { name: string; accountName?: string }[] }>(
      "https://mybusiness.googleapis.com/v4/accounts",
      accessToken
    );

    const all: any[] = [];
    for (const acc of accounts.accounts ?? []) {
      const locs = await gfetch<{ locations?: any[] }>(
        `https://mybusiness.googleapis.com/v4/${acc.name}/locations`,
        accessToken
      );
      (locs.locations ?? []).forEach((l) => all.push({ account: acc.name, location: l }));
    }

    res.json({ locations: all });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { gfetch } from "@/lib/google";
import authConfig from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authConfig as any);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  const { accountName, locationName, summary } = req.body as {
    accountName: string;              // "accounts/123456789"
    locationName: string;             // "accounts/123456789/locations/987654321"
    summary: string;                  // tekst posta
  };
  if (!accountName || !locationName || !summary)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const resp = await gfetch(
      `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`,
      accessToken,
      {
        method: "POST",
        body: JSON.stringify({
          languageCode: "en",
          summary,
          topicType: "STANDARD",
        }),
      }
    );

    res.json(resp);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

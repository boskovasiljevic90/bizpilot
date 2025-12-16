import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { gfetch } from "@/lib/google";
import authConfig from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authConfig as any);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  const { reviewName, comment } = req.body as {
    reviewName: string; // "accounts/{acct}/locations/{loc}/reviews/{reviewId}"
    comment: string;
  };
  if (!reviewName || !comment) return res.status(400).json({ error: "Missing fields" });

  try {
    // POST https://mybusiness.googleapis.com/v4/{reviewName}/reply
    const resp = await gfetch(
      `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
      accessToken,
      { method: "PUT", body: JSON.stringify({ comment }) } // API koristi setReply/put reply (varira po resursu)
    );
    res.json(resp);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

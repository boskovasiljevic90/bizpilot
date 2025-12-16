import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { gfetch } from "@/lib/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  const accessToken = (session as any)?.accessToken as string;
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  const { reviewName, comment } = req.body as { reviewName: string; comment: string };
  if (!reviewName || !comment) return res.status(400).json({ error: "Missing fields" });

  try {
    const resp = await gfetch(
      `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
      accessToken,
      { method: "PUT", body: JSON.stringify({ comment }) }
    );
    res.json(resp);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

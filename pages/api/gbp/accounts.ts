// pages/api/gbp/accounts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) {
      return res.status(401).json({ error: "Not connected to Google Business" });
    }

    const auth = fromSession(tokens);
    const url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";
    const { data }: any = await (auth as any).request({ url, method: "GET" });

    const accounts = (data?.accounts || []).map((a: any) => ({
      name: a.name,
      accountName: a.accountName,
      type: a.type,
      state: a.state?.status,
    }));

    return res.status(200).json({ ok: true, accounts });
  } catch (e: any) {
    return res.status(500).json({ error: "accounts failed", message: e?.message || String(e) });
  }
}

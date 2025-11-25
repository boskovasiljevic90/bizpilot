import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";
import type { GbpAccount } from "@/utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  const tokens = s.tokens;
  if (!tokens?.access_token) return res.status(401).json({ error: "Not connected to Google Business" });

  const auth = fromSession(tokens);
  const url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";
  const { data }: any = await (auth as any).request({ url, method: "GET" });

  const list: GbpAccount[] = Array.isArray(data?.accounts) ? data.accounts : [];
  const accounts = list.map(a => ({ name: a?.name ?? "", accountName: a?.accountName ?? "", type: a?.type ?? "" }));
  res.status(200).json({ accounts });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";
import type { GbpLocation } from "@/utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  const tokens = s.tokens;
  if (!tokens?.access_token) return res.status(401).json({ error: "Not connected to Google Business" });

  const account = req.query.account as string;
  if (!account) return res.status(400).json({ error: "Missing 'account' query param" });

  const auth = fromSession(tokens);
  const params = new URLSearchParams({ readMask: "name,title,storeCode,languageCode,profile,metadata" });
  const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodeURIComponent(account)}/locations?${params.toString()}`;
  const { data }: any = await (auth as any).request({ url, method: "GET" });

  const list: GbpLocation[] = Array.isArray(data?.locations) ? data.locations : [];
  const locations = list.map(l => ({
    name: l?.name ?? "",
    title: l?.title ?? "",
    storeCode: l?.storeCode ?? "",
    languageCode: l?.languageCode ?? ""
  }));
  res.status(200).json({ locations });
}

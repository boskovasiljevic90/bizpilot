// pages/api/auth/whoami.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokensFromCookie } from "@/utils/googleRequest";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const hasCookie = /gbp_tokens=/.test(req.headers?.cookie || "");
  const tokens = getTokensFromCookie(req);
  return res.status(200).json({
    cookiePresent: hasCookie,
    tokensParsed: !!tokens,
    scopesHint: (tokens as any)?.scope || null,
  });
}

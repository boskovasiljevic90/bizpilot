import type { NextApiRequest, NextApiResponse } from "next";
import { oauthClient } from "@/utils/google";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  s.tokens = undefined;
  s.email = null;
  await s.save();

  const client = oauthClient(req);
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/business.manage", "openid", "email"]
  });
  res.redirect(url);
}

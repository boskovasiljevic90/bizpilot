// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  s.email = null;
  s.plan = "free";
  s.tokens = undefined;
  await s.save();

  res.setHeader("Set-Cookie", [
    `bizpilot_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
  ]);

  res.redirect(302, "/");
}

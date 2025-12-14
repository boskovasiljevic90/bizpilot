import type { NextApiRequest, NextApiResponse } from "next";
import { oauthClient } from "@/utils/google";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Guard: env
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.SESSION_SECRET) {
      return res.status(500).json({
        error: "Missing OAuth env",
        need: {
          GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
          SESSION_SECRET_len: (process.env.SESSION_SECRET || "").length,
        },
      });
    }

    const s = await session(req, res);
    s.tokens = undefined;
    s.email = null;
    await s.save();

    const client = oauthClient(req);
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/business.manage", "openid", "email"],
    });
    res.redirect(url);
  } catch (e:any) {
    res.status(500).json({ error: "auth/google crashed", message: e?.message || String(e) });
  }
}

// pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.code as string) || "";
    if (!code) return res.status(400).json({ error: "Missing code" });

    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
    const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
    const redirectUri = `${base}/api/auth/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oidc = google.oauth2({ version: "v2", auth: oauth2Client });
    const me = await oidc.userinfo.get();
    const email = me.data.email || null;

    const s = await session(req, res);
    s.email = email;
    s.tokens = tokens as any;
    await s.save();

    res.redirect(302, "/dashboard");
  } catch (e: any) {
    res.status(500).json({ error: "callback failed", message: e?.message || String(e) });
  }
}

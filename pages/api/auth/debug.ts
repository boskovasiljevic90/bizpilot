import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  const cid = process.env.GOOGLE_CLIENT_ID ? "present" : "MISSING";
  const cs = process.env.GOOGLE_CLIENT_SECRET ? "present" : "MISSING";

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      base ? `${base}/api/auth/callback` : "(no BASE_URL)"
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/business.manage"],
    });

    return res.status(200).json({
      ok: true,
      NEXT_PUBLIC_APP_URL: base,
      GOOGLE_CLIENT_ID: cid,
      GOOGLE_CLIENT_SECRET: cs,
      redirect_uri_we_send: base ? `${base}/api/auth/callback` : null,
      sample_auth_url: url
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}

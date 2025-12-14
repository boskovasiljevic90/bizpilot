// pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  s.email = null;
  s.plan = s.plan || "free";
  s.tokens = undefined;
  await s.save();

  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
  const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
  const redirectUri = `${base}/api/auth/callback`;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Missing Google client env" });
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/business.manage",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  res.redirect(302, url);
}

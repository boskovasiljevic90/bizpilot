// pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!; // npr. https://needai.help

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !BASE_URL) {
    return res.status(500).send("Server misconfigured (Google env or BASE_URL missing).");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${BASE_URL}/api/auth/callback`
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/business.manage"],
  });

  return res.redirect(url);
}

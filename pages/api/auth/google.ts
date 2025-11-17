import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { serialize } from "cookie";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!; // npr. https://needai.help

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    const { error, error_description, code } = req.query as Record<string, string>;
    if (error) return res.status(400).send(`Google OAuth error: ${error}${error_description ? " - " + error_description : ""}`);
    if (!code) return res.status(400).send("Missing 'code'");

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !BASE_URL) {
      return res.status(500).send("Server misconfigured (Google env or BASE_URL missing).");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${BASE_URL}/api/auth/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens?.access_token) return res.status(500).send("Token exchange failed.");

    const data = Buffer.from(JSON.stringify(tokens)).toString("base64");
    res.setHeader("Set-Cookie", serialize("gbp_tokens", data, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30
    }));

    return res.redirect(302, "/dashboard");
  } catch (e: any) {
    return res.status(500).send(`OAuth callback crashed: ${e?.message || e}`);
  }
}

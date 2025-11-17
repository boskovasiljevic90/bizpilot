import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { serialize } from "cookie";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!; // npr. https://needai.help

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    // 1) Ako Google vrati error u query-ju, prikaži ga umesto 500
    const { error, error_description } = req.query as Record<string, string>;
    if (error) {
      console.error("OAuth error from Google:", error, error_description);
      return res
        .status(400)
        .send(`Google OAuth error: ${error}${error_description ? " - " + error_description : ""}`);
    }

    // 2) Proveri da imamo code
    const { code } = req.query as Record<string, string>;
    if (!code) {
      console.error("Missing 'code' query param on callback.");
      return res.status(400).send("Missing 'code' query param.");
    }

    // 3) Proveri ENV (čest uzrok 500)
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("GOOGLE_CLIENT_ID/SECRET missing in env.");
      return res.status(500).send("Server misconfigured (Google credentials missing).");
    }

    // 4) Zamena code -> token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${BASE_URL}/api/auth/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens?.access_token) {
      console.error("Token exchange failed:", tokens);
      return res.status(500).send("Token exchange failed.");
    }

    // 5) Snimi šifrovan cookie sa tokenima (MVP)
    const data = Buffer.from(JSON.stringify(tokens)).toString("base64");
    res.setHeader(
      "Set-Cookie",
      serialize("gbp_tokens", data, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
      })
    );

    // 6) Idi na dashboard
    return res.redirect(302, "/dashboard");
  } catch (e: any) {
    console.error("Callback fatal:", e?.message || e);
    return res.status(500).send(`OAuth callback crashed: ${e?.message || e}`);
  }
}

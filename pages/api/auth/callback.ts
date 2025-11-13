import { google } from "googleapis";
import { serialize } from "cookie";

export default async function handler(req: any, res: any) {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${req.headers.origin}/api/auth/callback`
  );

  const { tokens } = await oauth2Client.getToken(code as string);
  // tokens: { access_token, refresh_token, expiry_date, ... }

  // ⚠️ MVP: snimamo sve u šifrovani cookie (kratkoročno). Za produkciju preporuka: Vercel Postgres/Supabase.
  const data = Buffer.from(JSON.stringify(tokens)).toString("base64");
  res.setHeader("Set-Cookie", serialize("gbp_tokens", data, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }));

  res.redirect("/dashboard");
}

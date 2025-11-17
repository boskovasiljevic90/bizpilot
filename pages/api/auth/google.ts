import { google } from "googleapis";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!; // npr. https://needai.help

export default async function handler(req: any, res: any) {
  if (!BASE_URL) return res.status(500).send("BASE_URL (NEXT_PUBLIC_APP_URL) missing");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${BASE_URL}/api/auth/callback`
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/business.manage"],
  });

  // (Opcionalno) Ako želiš videti tačno šta šaljemo:
  // console.log("Auth URL:", url, "Redirect:", `${BASE_URL}/api/auth/callback`);

  res.redirect(url);
}

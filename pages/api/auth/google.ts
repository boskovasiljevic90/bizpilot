// pages/api/auth/google.ts
import { google } from "googleapis";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bizpilot-mnbfqjj3n-boskovasiljevic90s-projects.vercel.app";

export default async function handler(req: any, res: any) {
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

  res.redirect(url);
}

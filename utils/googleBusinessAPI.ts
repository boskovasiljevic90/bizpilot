import { google } from "googleapis";

export function getTokensFromCookie(req: any) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/gbp_tokens=([^;]+)/);
  if (!match) return null;
  try { return JSON.parse(Buffer.from(match[1], "base64").toString("utf8")); }
  catch { return null; }
}

export function getGMB(oauthTokens: any) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(oauthTokens);
  const mybusiness = google.mybusinessbusinessinformation({ version: "v1", auth: oauth2Client });
  const mybusinessAccountMgmt = google.mybusinessaccountmanagement({ version: "v1", auth: oauth2Client });
  const mybusinessLodging = google.mylocation({ version: "v1", auth: oauth2Client } as any);
  return { mybusiness, mybusinessAccountMgmt, mybusinessLodging };
}

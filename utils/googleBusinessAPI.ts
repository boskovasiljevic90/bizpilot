// utils/googleBusinessAPI.ts
import { google } from "googleapis";

/**
 * Izvlači OAuth token(e) iz httpOnly cookie-ja "gbp_tokens".
 * Čuvao si ih u callback ruti nakon Google consent-a.
 */
export function getTokensFromCookie(req: any) {
  const cookie = req.headers?.cookie || "";
  const m = cookie.match(/gbp_tokens=([^;]+)/);
  if (!m) return null;
  try {
    const json = Buffer.from(m[1], "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Pravi OAuth2 klijent sa već postojećim tokens (access/refresh).
 */
export function getOAuth2Client(oauthTokens: any) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials(oauthTokens);
  return oauth2;
}

/**
 * Vraća ispravne Business Profile API klijente.
 * Koristimo:
 *  - mybusinessbusinessinformation v1
 *  - mybusinessaccountmanagement v1
 *
 * (Ovo su PRAVE biblioteke koje postoje u "googleapis".)
 */
export function getGMB(oauthTokens: any): any {
  const auth = getOAuth2Client(oauthTokens);
  const mybusiness = google.mybusinessbusinessinformation({ version: "v1", auth });
  const mybusinessAccountMgmt = google.mybusinessaccountmanagement({ version: "v1", auth });
  return { mybusiness, mybusinessAccountMgmt };
}

// utils/googleRequest.ts
import { google } from "googleapis";

export function getTokensFromCookie(req: any) {
  const cookie = req.headers?.cookie || "";
  const m = cookie.match(/(?:^|;\s*)gbp_tokens=([^;]+)/);
  if (!m) return null;
  try {
    const raw = decodeURIComponent(m[1]);
    const json = Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getOAuthClient(tokens: any) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials(tokens);
  return oauth2;
}

export async function gRequest(oauth2: any, url: string, method: "GET" | "POST" = "GET", body?: any) {
  const opts: any = { url, method };
  if (body) {
    opts.data = body;
    opts.headers = { "Content-Type": "application/json" };
  }
  const { data } = await oauth2.request(opts);
  return data;
}

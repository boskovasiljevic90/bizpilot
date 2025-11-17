import { google } from "googleapis";

export function getTokensFromCookie(req: any) {
  const cookie = req.headers?.cookie || "";
  const m = cookie.match(/gbp_tokens=([^;]+)/);
  if (!m) return null;
  try { return JSON.parse(Buffer.from(m[1], "base64").toString("utf8")); }
  catch { return null; }
}

/** Vraća oauth2 klienta spremnog da šalje potpisane HTTP zahteve */
export function getOAuthClient(tokens: any) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials(tokens);
  return oauth2;
}

/** Jednostavan helper za GET/POST ka Google REST endpointima uz OAuth */
export async function gRequest(oauth2: any, url: string, method: "GET" | "POST" = "GET", body?: any) {
  const opts: any = { url, method };
  if (body) {
    opts.data = body;
    opts.headers = { "Content-Type": "application/json" };
  }
  // Koristimo ugrađeni HTTP klijent iz googleapis auth-a
  const { data } = await oauth2.request(opts);
  return data;
}

import { google } from "googleapis";
import type { NextApiRequest } from "next";
import type { SessionTokens } from "./types";

export function getBaseUrl(req: NextApiRequest) {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host!;
  return `${proto}://${host}`;
}

export function oauthClient(req: NextApiRequest) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${getBaseUrl(req)}/api/auth/callback`
  );
}

export function fromSession(tokens: SessionTokens) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials(tokens);
  return auth;
}

// utils/google.ts
import { google } from "googleapis";
import type { SessionTokens } from "./types";
import type { NextApiRequest } from "next";

export function oauthClient(req?: NextApiRequest) {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const redirectUri =
    process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
      : "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/** Vrati OAuth2 client sa ubačenim tokenima iz sesije */
export function fromSession(tokens: SessionTokens) {
  const client = oauthClient();
  client.setCredentials(tokens as any);
  return client;
}

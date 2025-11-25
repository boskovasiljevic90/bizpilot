// utils/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getIronSession,
  type SessionOptions,
  type IronSession,
} from "iron-session";
import type { SessionTokens, Plan } from "./types";

// Podaci koje čuvamo u sesiji (definišemo sami – ne importujemo IronSessionData)
export interface SessionData {
  tokens?: SessionTokens;
  email?: string | null;
  plan?: Plan;
}

// Tip same sesije (IronSession nad našim SessionData)
export type Session = IronSession<SessionData>;

const sessionOptions: SessionOptions = {
  cookieName: "bizpilot_session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: true,   // true na Vercel/HTTPS
    sameSite: "lax",
    path: "/",
  },
};

// Helper koji vraća *otipiziranu* sesiju
export async function session(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session> {
  return getIronSession<SessionData>(req, res, sessionOptions);
}

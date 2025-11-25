import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, type IronSessionOptions } from "iron-session";
import type { SessionTokens, Plan } from "./types";

declare module "iron-session" {
  interface IronSessionData {
    tokens?: SessionTokens;
    email?: string | null;
    plan?: Plan;
  }
}

const sessionOptions: IronSessionOptions = {
  cookieName: "bizpilot_session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: { secure: true, sameSite: "lax", path: "/" }
};

export async function session(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession(req, res, sessionOptions);
}

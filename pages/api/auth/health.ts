import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
    HAS_GOOGLE_ID: !!process.env.GOOGLE_CLIENT_ID,
    HAS_GOOGLE_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}

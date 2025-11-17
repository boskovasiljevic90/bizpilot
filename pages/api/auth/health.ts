import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const hasId = !!process.env.GOOGLE_CLIENT_ID;
  const hasSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const nodeEnv = process.env.NODE_ENV;

  return res.status(200).json({
    ok: true,
    NEXT_PUBLIC_APP_URL: baseUrl,
    GOOGLE_CLIENT_ID_present: hasId,
    GOOGLE_CLIENT_SECRET_present: hasSecret,
    NODE_ENV: nodeEnv
  });
}

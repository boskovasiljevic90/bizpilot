import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    host: req.headers.host || null,
    xForwardedProto: req.headers["x-forwarded-proto"] || null,
    cookiesHeaderBytes: (req.headers.cookie || "").length,
    hasSessionCookie: (req.headers.cookie || "").includes("bizpilot_session="),
    nodeEnv: process.env.NODE_ENV,
  });
}

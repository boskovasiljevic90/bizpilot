import type { NextApiRequest, NextApiResponse } from "next";
import { getPlan, LIMITS } from "@/utils/planLimits";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const plan = getPlan(req);
  return res.status(200).json({ plan, limits: LIMITS[plan] });
}

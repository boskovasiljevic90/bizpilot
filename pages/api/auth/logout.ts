import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  await s.destroy();
  res.redirect(302, "/");
}

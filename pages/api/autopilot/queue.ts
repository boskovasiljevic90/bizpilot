// pages/api/autopilot/queue.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { kvOk, kvRangeList } from "@/utils/kv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!kvOk()) return res.status(500).json({ ok: false, error: "KV not configured" });

  const s = await session(req, res);
  const email = s.email || "anon@user.local";

  const posts = await kvRangeList<{ ts: number; type: "post"; text: string }>(
    `autopilot:posts:${email}`,
    0,
    19
  );
  const replies = await kvRangeList<{ ts: number; type: "reply"; text: string }>(
    `autopilot:replies:${email}`,
    0,
    19
  );

  res.status(200).json({ ok: true, posts, replies });
}

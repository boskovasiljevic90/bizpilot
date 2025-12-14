import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

/**
 * Autopilot runner.
 * Cron ga zove POST-om; ovde odradiš šta treba (fetch recenzija, generiši objave, itd.)
 * Za test sada samo upišemo timestamp u KV i vratimo OK.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const reason =
      (typeof req.body === "object" && (req.body as any)?.reason) ||
      "manual";

    const ranAt = new Date().toISOString();

    // Minimalni trag u KV da vidimo da je radilo
    try {
      await kv.hset("autopilot:last", { ranAt, reason });
    } catch {
      // KV nije kritičan za prolazak testa
    }

    // TODO: ovde ubaci prave korake (GBP sync, AI generisanje, queue …)

    return res.status(200).json({ ok: true, ranAt, reason });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "failed" });
  }
}

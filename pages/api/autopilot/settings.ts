// pages/api/autopilot/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { kv, kvOk, kvGet, kvSet } from "@/utils/kv";

type Settings = {
  enabled: boolean;
  frequency: "daily" | "weekly";
  businessType: string;
  locale: string; // npr "en"
};

const DEFAULTS: Settings = {
  enabled: false,
  frequency: "weekly",
  businessType: "local business",
  locale: "en",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!kvOk()) return res.status(500).json({ ok: false, error: "KV not configured" });

  const s = await session(req, res);
  const email = s.email || "anon@user.local";
  const key = `autopilot:settings:${email}`;

  if (req.method === "GET") {
    const existing = (await kvGet<Settings>(key)) || DEFAULTS;
    return res.status(200).json({ ok: true, settings: existing });
  }

  if (req.method === "POST") {
    const body = (req.body || {}) as Partial<Settings>;
    const current = (await kvGet<Settings>(key)) || DEFAULTS;
    const next: Settings = {
      enabled: typeof body.enabled === "boolean" ? body.enabled : current.enabled,
      frequency: (body.frequency as any) || current.frequency,
      businessType: (body.businessType as any) || current.businessType,
      locale: (body.locale as any) || current.locale,
    };
    await kvSet(key, next);
    return res.status(200).json({ ok: true, settings: next });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}

// pages/api/cron/run.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { kvOk, kvPushList, kvGet } from "@/utils/kv";

// Koristi postojeće AI rute koje već imaš u projektu:
//  - /api/ai/postDraft  (body: { title })
//  - /api/ai/replyDraft (body: { review })
async function callJson(url: string, body: any) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (j?.error) throw new Error(j.error);
  return j;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!kvOk()) return res.status(500).json({ ok: false, error: "KV not configured" });

    // Ograniči na POST (da ne pokreće svako)
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    // U produkciji ćeš ovo zvati Vercel Cron-om bez sessiona. Za MVP koristimo session email.
    const s = await session(req, res);
    const email = s.email || "anon@user.local";

    // Učitaj autopilot podešavanja
    const settings = await kvGet<any>(`autopilot:settings:${email}`);
    if (!settings?.enabled) {
      return res.status(200).json({ ok: true, skipped: true, reason: "autopilot disabled" });
    }

    // Generiši post
    const post = await callJson(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/ai/postDraft`, {
      title: `Weekly update for ${settings.businessType}`,
    });
    const postText = post?.text || post?.post || "";

    if (postText) {
      await kvPushList(`autopilot:posts:${email}`, { ts: Date.now(), type: "post", text: postText });
    }

    // Generiši reply (stub: korišćen sample review; kad povežemo GBP, ovde listamo nove recenzije)
    const reviewSample =
      "Customer feedback: Service was fast and the staff was very helpful. Thanks!";
    const reply = await callJson(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/ai/replyDraft`, {
      review: reviewSample,
    });
    const replyText = reply?.text || reply?.reply || "";

    if (replyText) {
      await kvPushList(`autopilot:replies:${email}`, { ts: Date.now(), type: "reply", text: replyText });
    }

    return res.status(200).json({ ok: true, generated: { post: !!postText, reply: !!replyText } });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}

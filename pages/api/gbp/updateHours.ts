// pages/api/gbp/updateHours.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

/**
 * Prima "humanHours" string (npr. "Mon-Fri 09:00-17:00, Sat 10:00-14:00, Sun closed")
 * i šalje PATCH na businessinformation API (v1) sa radnim vremenom.
 * Ovo je simplifikacija – mapira osnovne slučajeve.
 */

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

function parseHumanHours(h: string) {
  // Vrlo uprošćeni parser – traži pattern "Mon-Fri 09:00-17:00" i sl.
  // Ako je previše slobodan unos, bolje ručno pratiti JSON format.
  const parts = h.split(",").map(s => s.trim()).filter(Boolean);
  const sets: { days: string[]; open?: string; close?: string }[] = [];

  for (const p of parts) {
    // examples: "Mon-Fri 09:00-17:00" / "Sun closed"
    const m = p.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(-(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?\s+(.+)$/i);
    if (!m) continue;
    const start = m[1]; const end = m[3];
    const tail = m[4].toLowerCase();

    const dayIndex = (abbr: string) => ["mon","tue","wed","thu","fri","sat","sun"].indexOf(abbr.toLowerCase());

    let list: string[] = [];
    if (end) {
      const sIdx = dayIndex(start), eIdx = dayIndex(end);
      if (sIdx <= eIdx) list = DAYS.slice(sIdx, eIdx + 1) as unknown as string[];
      else list = [...DAYS.slice(sIdx), ...DAYS.slice(0, eIdx + 1)] as unknown as string[];
    } else {
      list = [DAYS[dayIndex(start)] as unknown as string];
    }

    if (tail.includes("closed")) {
      sets.push({ days: list });
    } else {
      const hm = tail.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
      if (hm) {
        const open = `${hm[1].padStart(2,"0")}:${hm[2]}`;
        const close = `${hm[3].padStart(2,"0")}:${hm[4]}`;
        sets.push({ days: list, open, close });
      }
    }
  }

  // Konverzija u Period JSON (very basic: single period per day-set)
  const periods: any[] = [];
  for (const s of sets) {
    if (!s.open || !s.close) {
      // closed -> no periods for those days (GBP treats absence as closed)
      continue;
    }
    for (const d of s.days) {
      periods.push({
        openDay: d,
        openTime: s.open,
        closeDay: d,
        closeTime: s.close,
      });
    }
  }

  return { periods };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { location, humanHours } = req.body || {};
    if (!location || typeof location !== "string") {
      return res.status(400).json({ error: "Missing location" });
    }
    if (!humanHours || typeof humanHours !== "string") {
      return res.status(400).json({ error: "Missing humanHours" });
    }

    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) return res.status(401).json({ error: "Not connected to Google Business" });

    const { periods } = parseHumanHours(humanHours);

    const auth = fromSession(tokens);
    // PATCH businessinformation v1
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${encodeURIComponent(location)}?updateMask=regularHours`;
    const body = {
      regularHours: {
        periods, // {openDay, openTime, closeDay, closeTime}
      },
    };

    const { data }: any = await (auth as any).request({
      url,
      method: "PATCH",
      data: body,
    });

    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ error: "updateHours failed", message: e?.message || String(e) });
  }
}

// pages/api/ai/replyReview.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { review, locale } = req.body || {};
    const lang = typeof locale === "string" ? locale : "en";
    const text = typeof review === "string" ? review.slice(0, 2000) : "";

    if (!text) return res.status(400).json({ error: "Missing review" });

    const prompt = `Locale: ${lang}
Customer review:
${text}

Write a concise, polite, professional owner reply suitable for a Google Business review. Keep it brief, friendly, and specific to the content.`;

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: "You write concise, warm owner replies to customer reviews." },
        { role: "user", content: prompt },
      ],
    });

    const reply = r.choices?.[0]?.message?.content?.trim() || "";
    if (!reply) return res.status(500).json({ error: "No reply from model" });

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "failed" });
  }
}

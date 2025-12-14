import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// ENV: OPENAI_API_KEY mora da postoji
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { businessType, locale, specials } = req.body || {};
    const lang = typeof locale === "string" ? locale : "en";

    const prompt = [
      `You are BizPilot, an AI Google Business Manager.`,
      `Generate ONE concise Google Business Profile post (max 700 characters) in ${lang}.`,
      `Business type: ${businessType || "general small business"}.`,
      specials ? `Promotions/specials to mention: ${specials}.` : "",
      `Include a short call-to-action and relevant emojis sparingly.`,
      `Return ONLY raw post text, no markdown, no prefixes.`
    ].filter(Boolean).join("\n");

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You write polished, local-business-friendly posts for Google Business."},
        { role: "user", content: prompt }
      ]
    });

    const text = r.choices?.[0]?.message?.content?.trim() || "";
    if (!text) return res.status(500).json({ error: "No text from model" });

    return res.status(200).json({ ok: true, post: text });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "failed" });
  }
}

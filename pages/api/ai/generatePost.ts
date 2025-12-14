// pages/api/ai/generatePost.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * AI generisanje bez SDK-a (čist fetch), da izbegnemo tip/SDK konflikte.
 * ENV: OPENAI_API_KEY (obavezno)
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // brz, jeftin, dobar kvalitet za tekst

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const { purpose, businessType, reviewText, starRating, languageHint } = req.body || {};

    const prompt =
      purpose === "review-reply"
        ? `You are a business profile manager. Write a short, polite and helpful reply to a customer review.
Business type: ${businessType || "local business"}.
Star rating: ${starRating || "N/A"}.
Review text: """${(reviewText || "").slice(0, 2000)}"""
Write the reply in the same language as the review.`
        : `You are a business profile manager. Draft a concise Google Business Profile post (max 80 words) for a ${businessType || "local business"}.
No hashtags, no emojis unless natural. Include a clear call-to-action. Language: ${languageHint || "English"}.`;

    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You manage Google Business Profiles and write succinct, helpful text." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const j = await r.json();
    if (!r.ok) {
      return res.status(500).json({ error: "openai failed", message: j?.error?.message || "unknown" });
    }

    const text = j?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ ok: true, text });
  } catch (e: any) {
    return res.status(500).json({ error: "ai failed", message: e?.message || String(e) });
  }
}

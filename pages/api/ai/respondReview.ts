import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { reviewText, rating, locale, businessName } = req.body || {};
    const lang = typeof locale === "string" ? locale : "en";
    if (!reviewText) return res.status(400).json({ error: "Missing reviewText" });

    const prompt = [
      `You are BizPilot, an expert Google Business review responder.`,
      `Write a friendly, professional reply in ${lang} for Google Business.`,
      businessName ? `Business name: ${businessName}.` : "",
      typeof rating === "number" ? `Review rating: ${rating}/5.` : "",
      `Customer review: """${reviewText}"""`,
      `Rules:`,
      `- If rating is low or review is negative, apologize and invite them to DM/call.`,
      `- If rating is high or review is positive, thank them warmly and reference specific points.`,
      `- Keep it under 700 characters.`,
      `Return ONLY the reply text, no labels or markdown.`
    ].filter(Boolean).join("\n");

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: "You write concise, on-brand replies for Google Business reviews."},
        { role: "user", content: prompt }
      ]
    });

    const text = r.choices?.[0]?.message?.content?.trim() || "";
    if (!text) return res.status(500).json({ error: "No text from model" });

    return res.status(200).json({ ok: true, reply: text });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "failed" });
  }
}

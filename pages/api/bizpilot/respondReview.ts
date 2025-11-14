import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie /*, getGMB */ } from "@/utils/googleBusinessAPI";
import { getPlan /*, LIMITS */ } from "@/utils/planLimits";

/**
 * POST /api/bizpilot/respondReview
 * Body: { reviewText: string, businessName: string, language?: string, sentimentHint?: "positive" | "neutral" | "negative" }
 * MVP: generiše reply; TODO: publish odgovora na Business Profile API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const plan = getPlan(req);
    // TODO: Proveri limite po planu uz DB brojače.

    const tokens = getTokensFromCookie(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

    const { reviewText, businessName, language = "auto", sentimentHint } = req.body || {};
    if (!reviewText || !businessName) {
      return res.status(400).json({ error: "reviewText and businessName are required" });
    }

    const prompt = `You're replying to a Google review for "${businessName}".
Review text: "${reviewText}"
Language: ${language}
Sentiment hint: ${sentimentHint || "detect automatically"}

Write a concise, empathetic, brand-safe reply:
- Acknowledge the customer's point
- If negative: apologize without admitting fault, propose a concrete next step (DM/phone/email)
- If positive: express gratitude, invite a next visit or action
- Avoid making unverifiable promises
- Keep it under 120 words`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You craft concise, brand-safe replies to Google reviews." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // TODO: Publish reply na Business Profile API
    // const { mybusiness } = getGMB(tokens);
    // await mybusiness.accounts.locations.reviews.updateReply({ ... })

    return res.status(200).json({
      plan,
      reply: text,
      note: "MVP returns generated reply only. Publishing to GBP API to be wired next."
    });
  } catch (err: any) {
    console.error("respondReview error:", err?.message || err);
    return res.status(500).json({ error: "Respond review failed", detail: String(err?.message || err) });
  }
}

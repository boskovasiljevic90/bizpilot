import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie, getGMB } from "@/utils/googleBusinessAPI";

/**
 * GET /api/bizpilot/analytics
 * MVP: vraća sample metrike + AI insighte.
 * TODO: Zameniti sample metrikama iz Business Profile/Insights API-ja.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).end();

    const tokens = getTokensFromCookie(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

    // Primer: inicijalizacija klijenata (kad budeš vukao realne metrike).
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mybusiness } = getGMB(tokens);

    // MVP: statički primer metrika
    const metrics = { views: 1234, calls: 56, websiteClicks: 78, directionRequests: 31, period: "last_28_days" };

    const prompt = `You are a Google Business analytics assistant.
Given these metrics ${JSON.stringify(metrics)}, write:
- 5 concise bullet-point insights
- 3 prioritized actions to improve results
Keep it actionable and business-friendly.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful analytics assistant for Google Business Profile." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return res.status(200).json({ metrics, insights: text });
  } catch (err: any) {
    console.error("analytics error:", err?.message || err);
    return res.status(500).json({ error: "Analytics failed", detail: String(err?.message || err) });
  }
}

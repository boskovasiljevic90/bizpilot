import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie, getGMB } from "@/utils/googleBusinessAPI";
import { getPlan /*, LIMITS */ } from "@/utils/planLimits";

/**
 * POST /api/bizpilot/createPost
 * Body: { locationId: string, topic: string, language?: string }
 * MVP: generiše tekst objave; TODO: dodati publish na Business Profile API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const plan = getPlan(req);
    // TODO: Proveri mesečne limite po planu (uz DB brojač). Za MVP ne blokiramo.

    const tokens = getTokensFromCookie(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

    const { locationId, topic, language = "auto" } = req.body || {};
    if (!locationId || !topic) {
      return res.status(400).json({ error: "locationId and topic are required" });
    }

    const prompt = `Create a high-converting Google Business post for a small business.
Topic: ${topic}
Language: ${language}.
Guidelines:
- Max ~700 characters
- Clear CTA
- Adapt tone to SMB and local audience
- Avoid hashtags, keep it clean and on-brand`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert social media copywriter for Google Business Posts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // TODO: Publish na Business Profile API (novi endpoints).
    // const { mybusiness } = getGMB(tokens);
    // await mybusiness.locations.localPosts.create({ ... })

    return res.status(200).json({
      plan,
      post: text,
      note: "MVP returns generated text only. Publishing to GBP API to be wired next."
    });
  } catch (err: any) {
    console.error("createPost error:", err?.message || err);
    return res.status(500).json({ error: "Create post failed", detail: String(err?.message || err) });
  }
}

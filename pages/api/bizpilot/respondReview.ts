import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie } from "@/utils/googleBusinessAPI";
import { getPlan } from "@/utils/planLimits";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const plan = getPlan(req);
  const tokens = getTokensFromCookie(req);
  if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

  const { reviewText, businessName, language = "auto", sentimentHint } = req.body;

  const prompt = `Review: "${reviewText}". Business: ${businessName}. 
  Write a concise, empathetic reply in ${language}. Keep brand-safe, avoid promises, invite next step.`;

  const ai = await openai.responses.create({ model: "gpt-4.1-mini", input: prompt });
  const text = ai.output[0].content[0].text;

  return res.status(200).json({ reply: text, note: "MVP returns reply; publishing endpoint to wire next." });
}

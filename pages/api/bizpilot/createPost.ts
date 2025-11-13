import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie, getGMB } from "@/utils/googleBusinessAPI";
import { getPlan, LIMITS } from "@/utils/planLimits";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const plan = getPlan(req);
  // TODO: implementiraj mesečni counter uz DB; MVP: ne blokiramo strogo
  const tokens = getTokensFromCookie(req);
  if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

  const { locationId, topic, language = "auto" } = req.body;

  const prompt = `Write an engaging Google Business post for a small business. Topic: ${topic}. 
  Language: ${language}. Keep it under 700 characters, include a clear CTA, adapt tone to SMB.`;

  const ai = await openai.responses.create({ model: "gpt-4.1-mini", input: prompt });
  const text = ai.output[0].content[0].text;

  const { mybusiness } = getGMB(tokens);
  // NOTE: stvarni endpoint za postove je u My Business API (v4 legacy) / New Business Profile APIs.
  // MVP: vraćamo generisan tekst (manualno lepiš u GBP dok ne aktiviramo finalni publish endpoint).
  return res.status(200).json({ post: text, note: "MVP returns generated text; publishing endpoint to wire next." });
}

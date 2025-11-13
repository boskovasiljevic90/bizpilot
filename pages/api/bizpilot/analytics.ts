import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/utils/openaiClient";
import { getTokensFromCookie, getGMB } from "@/utils/googleBusinessAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const tokens = getTokensFromCookie(req);
  if (!tokens) return res.status(401).json({ error: "Not connected to Google Business" });

  // TODO: povuci realne metrike iz GBP Insights (novi APIs). MVP: lažni sample + AI komentari.
  const metrics = { views: 1234, calls: 56, websiteClicks: 78, directionRequests: 31, period: "last_28_days" };
  const prompt = `Given metrics ${JSON.stringify(metrics)}, write a 5-bullet insight summary and 3 actions.`;

  const ai = await openai.responses.create({ model: "gpt-4.1-mini", input: prompt });
  const text = ai.output[0].content[0].text;

  return res.status(200).json({ metrics, insights: text });
}

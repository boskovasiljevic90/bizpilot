import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");
    const { title } = req.body || {};
    if (!title) return res.status(400).json({ error: "Missing 'title'" });
    const prompt = `Write a concise, engaging Google Business post (max 700 chars). Any language. Topic: ${title}. Include 3 relevant hashtags.`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content || "Failed to generate.";
    res.status(200).json({ text });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || "AI failed" });
  }
}

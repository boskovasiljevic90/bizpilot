import type { NextApiRequest, NextApiResponse } from "next";

function getBaseUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host!;
  return `${proto}://${host}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel Cron šalje GET; ostavimo i POST za ručni test
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Vercel automatski dodaje: Authorization: Bearer ${CRON_SECRET}
  const want = process.env.CRON_SECRET || "";
  const auth = (req.headers.authorization || "").trim();
  const isBearerValid = auth === `Bearer ${want}`;

  // Dozvoli i ?secret=… kao alternativu za ručne testove u browseru
  const qsOK = (req.query.secret as string) === want;

  if (!want || (!isBearerValid && !qsOK)) {
    return res.status(401).json({ error: "Unauthorized (bad or missing secret)" });
  }

  try {
    const base = getBaseUrl(req);
    const r = await fetch(`${base}/api/autopilot/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "cron" })
    });
    const payload = await r.json().catch(() => ({}));
    return res.status(200).json({ ok: true, status: r.status, payload });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "cron failed" });
  }
}

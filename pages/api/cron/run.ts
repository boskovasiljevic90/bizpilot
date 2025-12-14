import type { NextApiRequest, NextApiResponse } from "next";

/** Build absolute URL to our own API */
function getBaseUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host!;
  return `${proto}://${host}`;
}

/** Allow GET (for Vercel Cron UI) and POST (for manual curl). Secret ide u query ?secret= */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const want = process.env.CRON_SECRET || "";
  const fromHeader = (req.headers["x-cron-secret"] as string) || "";
  const fromQuery = (req.query.secret as string) || "";
  const provided = fromHeader || fromQuery;

  if (!want || provided !== want) {
    return res.status(401).json({ error: "Unauthorized (bad or missing secret)" });
  }

  try {
    const base = getBaseUrl(req);

    const r = await fetch(`${base}/api/autopilot/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "cron" }),
    });

    const payload = await r.json().catch(() => ({}));
    return res.status(200).json({ ok: true, status: r.status, payload });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "cron failed" });
  }
}

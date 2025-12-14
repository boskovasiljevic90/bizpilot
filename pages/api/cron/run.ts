import type { NextApiRequest, NextApiResponse } from "next";

/** Small helper to build an absolute URL to our own API */
function getBaseUrl(req: NextApiRequest) {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host!;
  return `${proto}://${host}`;
}

/** Only allow POST with a secret header so the endpoint can't be abused. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const got = (req.headers["x-cron-secret"] as string) || "";
  const want = process.env.CRON_SECRET || "";
  if (!want || got !== want) {
    return res.status(401).json({ error: "Unauthorized (bad cron secret)" });
  }

  try {
    const base = getBaseUrl(req);

    // Trigger our existing Autopilot runner.
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

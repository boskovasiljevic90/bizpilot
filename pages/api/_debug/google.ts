// pages/api/_debug/google.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) return res.status(401).json({ error: "no session tokens" });

    // Google token info endpoint – pokazuje scope-ove
    const infoRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(tokens.access_token)}`
    );
    const info = await infoRes.json();

    return res.status(200).json({
      ok: true,
      email: s.email || null,
      plan: s.plan || null,
      tokeninfo: info, // gledaš "scope": "... business.manage ..."
      note:
        "Ako ne vidiš 'business.manage' u scope, treba ponovo odobriti login sa traženim scope-om, i u GCP uključiti Business Profile API.",
    });
  } catch (e: any) {
    return res.status(500).json({ error: "debug failed", message: e?.message || String(e) });
  }
}

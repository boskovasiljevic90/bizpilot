import type { NextApiRequest, NextApiResponse } from "next";
import { oauthClient } from "@/utils/google";
import { session } from "@/utils/session";
import type { SessionTokens } from "@/utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ error: "Missing code" });

    const client = oauthClient(req);
    const { tokens } = await client.getToken(code);
    if (!tokens?.access_token) return res.status(502).json({ error: "Token exchange failed" });

    let email: string | null = null;
    try {
      const idt = tokens.id_token as string | undefined;
      if (idt) {
        const payload = JSON.parse(Buffer.from(idt.split(".")[1], "base64").toString());
        email = payload?.email || null;
      }
    } catch {}

    const slim: SessionTokens = {
      access_token: tokens.access_token || null,
      refresh_token: tokens.refresh_token || null,
      expiry_date: tokens.expiry_date || null,
      scope: tokens.scope || null,
      token_type: tokens.token_type || "Bearer",
    };

    const s = await session(req, res);
    s.tokens = slim;
    s.email = email;
    if (!s.plan) s.plan = "free";
    await s.save();

    res.redirect(302, "/dashboard");
  } catch (e:any) {
    res.status(500).json({ error: "auth/callback crashed", message: e?.message || String(e) });
  }
}

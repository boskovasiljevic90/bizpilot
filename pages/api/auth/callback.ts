import type { NextApiRequest, NextApiResponse } from "next";
import { oauthClient } from "@/utils/google";
import { session } from "@/utils/session";
import type { SessionTokens } from "@/utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await session(req, res);
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Missing code");

    const client = oauthClient(req);
    const { tokens } = await client.getToken(code);
    if (!tokens?.access_token) return res.status(500).send("Token exchange failed");

    // get email from id_token if present
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
      token_type: tokens.token_type || "Bearer"
    };

    s.tokens = slim;
    s.email = email;
    // plan defaults to 'free', Stripe webhook can upgrade to 'pro'
    if (!s.plan) s.plan = "free";
    await s.save();

    res.redirect(302, "/dashboard");
  } catch (e: any) {
    res.status(500).send(`OAuth callback crashed: ${e?.message || e}`);
  }
}

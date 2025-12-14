// utils/session.ts
// Minimalna cookie sesija bez eksternih paketa.
// Radi u Next API rutama i dovoljna je za MVP (email/plan/tokens).

import type { NextApiRequest, NextApiResponse } from "next";

export type Plan = "free" | "pro";

export type SessionTokens =
  | { access_token: string; refresh_token?: string; expiry_date?: number }
  | undefined;

export type SessionShape = {
  email?: string | null;
  plan?: Plan;
  tokens?: SessionTokens;
};

const COOKIE_NAME = "bizpilot_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Parsira cookie header u mapu key=value */
function parseCookie(header?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > -1) {
      const k = p.slice(0, i).trim();
      const v = p.slice(i + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

/** Bezbedno čitanje JSON-a iz base64 cookie vrednosti */
function readSessionFromCookie(req: NextApiRequest): SessionShape {
  try {
    const cookies = parseCookie(req.headers?.cookie || "");
    const raw = cookies[COOKIE_NAME];
    if (!raw) return { plan: "free" };
    const json = Buffer.from(raw, "base64").toString("utf8");
    const data = JSON.parse(json);
    return {
      email: typeof data?.email === "string" ? data.email : null,
      plan: (data?.plan === "pro" ? "pro" : "free") as Plan,
      tokens: data?.tokens && typeof data.tokens === "object" ? data.tokens : undefined,
    };
  } catch {
    return { plan: "free" };
  }
}

/** Upis cookie-a u odgovor */
function writeSessionCookie(res: NextApiResponse, s: SessionShape) {
  const payload = {
    email: s.email || null,
    plan: s.plan || "free",
    tokens: s.tokens || undefined,
  };
  const b64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
  const cookie =
    `${COOKIE_NAME}=${encodeURIComponent(b64)}; ` +
    `Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${ONE_YEAR}`;
  // Append, ne overwrite (ako već ima neki Set-Cookie)
  const prev = res.getHeader("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", [...prev, cookie]);
  } else {
    res.setHeader("Set-Cookie", [String(prev), cookie]);
  }
}

/**
 * session(req,res) – vrati sesiju i save() metodu.
 * Upotreba:
 *   const s = await session(req,res);
 *   s.email = "user@example.com"; s.plan = "pro"; await s.save();
 */
export async function session(req: NextApiRequest, res: NextApiResponse) {
  const state: SessionShape = readSessionFromCookie(req);
  if (!state.plan) state.plan = "free";

  return {
    ...state,
    async save() {
      writeSessionCookie(res, this as SessionShape);
    },
  } as SessionShape & { save: () => Promise<void> };
}

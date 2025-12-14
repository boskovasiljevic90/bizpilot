// utils/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import type { SessionShape, SessionTokens, Plan } from "./types";

/**
 * Minimalna, HMAC-cookie sesija (bez third-party paketa).
 * Potrebno: SESSION_SECRET (>=32 char) u Vercel env.
 * Cookie: bp_sess (signed, base64url)
 */

const COOKIE_NAME = "bp_sess";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // ~60 dana

function getSecret(): Buffer {
  const s = (process.env.SESSION_SECRET || "").trim();
  if (s.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return Buffer.from(s, "utf8");
}

function sign(data: string, secret: Buffer) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

function serializeCookie(name: string, value: string, maxAge: number) {
  const parts = [`${name}=${value}`, "Path=/", "HttpOnly", "SameSite=Lax", "Secure"];
  if (maxAge > 0) parts.push(`Max-Age=${maxAge}`);
  return parts.join("; ");
}

function parseCookie(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > -1) {
      const k = p.slice(0, i).trim();
      const v = p.slice(i + 1).trim();
      out[k] = v;
    }
  });
  return out;
}

function encodePayload(obj: SessionShape, secret: Buffer): string {
  const json = JSON.stringify(obj);
  const payload = Buffer.from(json, "utf8").toString("base64url");
  const sig = sign(payload, secret);
  return `${payload}.${sig}`;
}

function decodePayload(value: string, secret: Buffer): SessionShape | null {
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload, secret);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const obj = JSON.parse(json);
    const out: SessionShape = {
      email: obj?.email ?? null,
      plan: (obj?.plan ?? "free") as Plan,
      tokens: obj?.tokens as SessionTokens | undefined,
    };
    return out;
  } catch {
    return null;
  }
}

export async function session(req: NextApiRequest, res: NextApiResponse) {
  const secret = getSecret();
  const cookies = parseCookie(req.headers.cookie);
  const raw = cookies[COOKIE_NAME];
  let data: SessionShape = { email: null, plan: "free" };

  if (raw) {
    const dec = decodePayload(raw, secret);
    if (dec) data = dec;
  }

  return {
    get email() { return data.email; },
    set email(v: string | null) { data.email = v; },
    get plan() { return data.plan; },
    set plan(v: Plan) { data.plan = v; },
    get tokens() { return data.tokens; },
    set tokens(v: SessionTokens | undefined) { data.tokens = v; },
    async save() {
      const encoded = encodePayload(data, secret);
      res.setHeader("Set-Cookie", serializeCookie(COOKIE_NAME, encoded, COOKIE_MAX_AGE));
    },
    async destroy() {
      res.setHeader("Set-Cookie", serializeCookie(COOKIE_NAME, "", 0));
    },
  };
}

export type { SessionTokens, SessionShape, Plan };

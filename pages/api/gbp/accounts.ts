// pages/api/gbp/accounts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/utils/session";
import { fromSession } from "@/utils/google";

/**
 * Pokuša 2 endpointa za listanje naloga:
 *  1) mybusinessaccountmanagement.googleapis.com/v1/accounts
 *  2) businessprofile.googleapis.com/v1/accounts
 * Vraća punu poruku greške iz Google-a radi dijagnostike.
 */

async function tryFetch(auth: any, url: string) {
  try {
    const r: any = await auth.request({ url, method: "GET" });
    return { ok: true, data: r.data };
  } catch (e: any) {
    const msg = e?.response?.data || e?.message || String(e);
    return { ok: false, error: msg };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const s = await session(req, res);
    const tokens = s.tokens;
    if (!tokens?.access_token) {
      return res.status(401).json({ error: "Not connected to Google Business" });
    }

    const auth = fromSession(tokens);

    // 1) stari (Account Management)
    const u1 = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";
    const r1 = await tryFetch(auth, u1);

    let accounts: any[] = [];
    let diag: any = { tried: [u1] };

    if (r1.ok) {
      accounts = r1.data?.accounts || [];
    } else {
      diag.firstError = r1.error;

      // 2) novi (Business Profile)
      const u2 = "https://businessprofile.googleapis.com/v1/accounts";
      const r2 = await tryFetch(auth, u2);
      diag.tried.push(u2);

      if (r2.ok) {
        accounts = r2.data?.accounts || [];
      } else {
        diag.secondError = r2.error;

        // Ni jedan endpoint nije prošao — vrati detaljnu poruku
        return res.status(502).json({
          error: "accounts failed",
          hint:
            "Najčešći uzroci: 1) Nije uključen Business Profile API u Google Cloud. 2) OAuth nema scope https://www.googleapis.com/auth/business.manage. 3) Nalog nema GBP pristup.",
          details: diag,
        });
      }
    }

    const mapped = accounts.map((a: any) => ({
      name: a.name, // "accounts/XXXX"
      accountName: a.accountName || a.accountName?.displayName || a.name,
      type: a.type,
      state: a.state?.status || a.state,
    }));

    return res.status(200).json({ ok: true, accounts: mapped, rawCount: accounts.length });
  } catch (e: any) {
    return res.status(500).json({ error: "accounts crashed", message: e?.message || String(e) });
  }
}

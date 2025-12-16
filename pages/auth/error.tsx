// pages/auth/error.tsx
import { useRouter } from "next/router";

const MESSAGES: Record<string, string> = {
  Configuration: "Provider ili NextAuth konfiguracija je neispravna.",
  AccessDenied: "Pristup odbijen (scopes/consent).",
  Verification: "Link je istekao ili neispravan.",
  OAuthSignin: "Greška prilikom započinjanja OAuth-a.",
  OAuthCallback: "Greška u OAuth callback-u (redirect URI/origins?).",
  OAuthCreateAccount: "Nije moguće kreirati nalog.",
  OAuthAccountNotLinked: "Email je već vezan za drugog providera.",
  EmailCreateAccount: "Problem pri kreiranju email naloga.",
  Callback: "Greška u NextAuth callback-u.",
  OAuthProfileParseError: "Neuspešno parsiranje OAuth profila.",
};

export default function AuthError() {
  const { query } = useRouter();
  const code = (query.error as string) || "Unknown";
  const message = MESSAGES[code] || "Nepoznata greška.";
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center">
      <div className="rounded-2xl border border-white/10 p-8 max-w-xl">
        <h1 className="text-2xl font-bold">Auth error</h1>
        <p className="mt-2 text-slate-300">{message}</p>
        <pre className="mt-4 text-xs bg-black/30 p-3 rounded border border-white/10">
          code={code}
        </pre>
        <p className="mt-3 text-sm text-slate-400">
          Ako je <b>OAuthCallback</b>: proveri Redirect URI & Authorized JavaScript origins.
        </p>
      </div>
    </main>
  );
}

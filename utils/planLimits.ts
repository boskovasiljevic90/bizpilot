export type Plan = "freemium" | "trial" | "premium";

export function getPlan(req: any): Plan {
  const cookie = req.headers.cookie || "";
  const m = cookie.match(/plan=([^;]+)/);
  return (m?.[1] as Plan) || "freemium";
}

export const LIMITS = {
  freemium: { postsPerMonth: 3, reviewRepliesPerMonth: 5 },
  trial:    { postsPerMonth: 9999, reviewRepliesPerMonth: 9999 },
  premium:  { postsPerMonth: 9999, reviewRepliesPerMonth: 9999 }
};

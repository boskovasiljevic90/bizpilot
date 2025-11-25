export type SessionTokens = {
  access_token: string | null;
  refresh_token: string | null;
  expiry_date: number | null;
  scope: string | null;
  token_type: string | null;
};
export type GbpAccount = { name?: string; accountName?: string; type?: string };
export type GbpLocation = { name?: string; title?: string; storeCode?: string; languageCode?: string };
export type Plan = "free" | "pro";

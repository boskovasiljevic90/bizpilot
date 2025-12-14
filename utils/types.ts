// utils/types.ts

export type Plan = "free" | "pro" | null;

export type SessionTokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expiry_date?: number;
  token_type?: string;
};

export type SessionShape = {
  email: string | null;
  plan: Plan;
  tokens?: SessionTokens | undefined;
};

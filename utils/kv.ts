// utils/kv.ts
import { createClient } from "@vercel/kv";

const url = process.env.KV_REST_API_URL || "";
const token = process.env.KV_REST_API_TOKEN || "";

export const kv = url && token ? createClient({ url, token }) : null;

export function kvOk() {
  return !!kv;
}

export async function kvGet<T = any>(key: string): Promise<T | null> {
  if (!kv) return null;
  return (await kv.get(key)) as T | null;
}

export async function kvSet<T = any>(key: string, value: T, ttlSeconds?: number) {
  if (!kv) return;
  if (ttlSeconds) return kv.set(key, value, { ex: ttlSeconds });
  return kv.set(key, value);
}

export async function kvPushList<T = any>(key: string, value: T) {
  if (!kv) return;
  return kv.lpush(key, JSON.stringify(value));
}

export async function kvRangeList<T = any>(key: string, start = 0, end = 19): Promise<T[]> {
  if (!kv) return [];
  const raw = await kv.lrange<string>(key, start, end);
  return raw.map((x) => JSON.parse(x) as T);
}

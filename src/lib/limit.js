// src/lib/limit.js
import { kv, createClient } from "@vercel/kv";        // ⬅️ auto-reads KV_* envs
import { Ratelimit } from "@upstash/ratelimit";

// 200 messages per rolling 24 h
// Prefer the dedicated aub_* KV if provided, else fall back to default KV
const aubKv = (process.env.aub_KV_REST_API_URL && process.env.aub_KV_REST_API_TOKEN)
  ? createClient({ url: process.env.aub_KV_REST_API_URL, token: process.env.aub_KV_REST_API_TOKEN })
  : kv;

export const limiter = new Ratelimit({
  redis: aubKv,
  limiter: Ratelimit.slidingWindow(200, "24 h"),
  prefix: "aub",
});

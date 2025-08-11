// src/lib/limit.js
import { kv } from "@vercel/kv";        // ⬅️ auto-reads KV_REST_API_URL / TOKEN
import { Ratelimit } from "@upstash/ratelimit";

// 200 messages per rolling 24 h
export const limiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(200, "24 h"),
  prefix: "aub",
});

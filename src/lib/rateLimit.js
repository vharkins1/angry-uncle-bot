// src/lib/rateLimit.js
const buckets = new Map();

/**
 * Simple token-bucket throttle: limit requests per IP per time window.
 * @returns {boolean} true if request is allowed, false if rate-limited
 */
export default function rateLimit(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { n: 0, ts: now };

  // reset bucket every window
  if (now - bucket.ts > windowMs) {
    bucket.n = 0;
    bucket.ts = now;
  }

  bucket.n += 1;
  buckets.set(ip, bucket);

  return bucket.n <= limit;
}

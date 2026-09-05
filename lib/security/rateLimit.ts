/**
 * In-memory Sliding Window Rate Limiter
 * Guards sensitive API routes (e.g. auth, report upload, export) against brute force and Denial of Service (DoS) attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60,000ms = 1 min)
  maxRequests?: number; // Maximum allowed requests in window (default: 60)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetMs: number } {
  const windowMs = options.windowMs || 60000;
  const maxRequests = options.maxRequests || 60;
  const now = Date.now();

  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter out timestamps older than the sliding window
  const validTimestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp));
    return {
      allowed: false,
      remaining: 0,
      resetMs
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs
  };
}

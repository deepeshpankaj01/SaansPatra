export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private requestMap: Map<string, number[]>;

  constructor(windowMs = 60000, maxRequests = 60) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requestMap = new Map();

    // Periodically clean up stale records every 5 minutes
    if (typeof setInterval !== 'undefined') {
      const interval = setInterval(() => {
        const now = Date.now();
        for (const [ip, timestamps] of this.requestMap.entries()) {
          const fresh = timestamps.filter((t) => now - t < this.windowMs);
          if (fresh.length === 0) {
            this.requestMap.delete(ip);
          } else {
            this.requestMap.set(ip, fresh);
          }
        }
      }, 300000);
      if (interval.unref) interval.unref();
    }
  }

  check(ip: string): RateLimitResult {
    const now = Date.now();
    const timestamps = this.requestMap.get(ip) || [];

    // Filter to requests within current sliding window
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      const oldest = validTimestamps[0];
      const resetMs = Math.max(0, this.windowMs - (now - oldest));
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    validTimestamps.push(now);
    this.requestMap.set(ip, validTimestamps);

    return {
      allowed: true,
      remaining: this.maxRequests - validTimestamps.length,
      resetMs: this.windowMs,
    };
  }

  reset(): void {
    this.requestMap.clear();
  }
}

// Global default rate limiter instance: 60 req/min
export const defaultRateLimiter = new RateLimiter(60000, 60);

import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '@/lib/security/rateLimiter';

describe('Sliding window rate limiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(1000, 3); // 3 requests per 1000ms
  });

  it('allows requests within limit', () => {
    expect(limiter.check('1.2.3.4').allowed).toBe(true);
    expect(limiter.check('1.2.3.4').allowed).toBe(true);
    expect(limiter.check('1.2.3.4').allowed).toBe(true);
  });

  it('blocks requests exceeding limit', () => {
    limiter.check('1.2.3.4');
    limiter.check('1.2.3.4');
    limiter.check('1.2.3.4');
    const blocked = limiter.check('1.2.3.4');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it('tracks distinct IPs independently', () => {
    limiter.check('1.2.3.4');
    limiter.check('1.2.3.4');
    limiter.check('1.2.3.4');
    expect(limiter.check('1.2.3.4').allowed).toBe(false);
    expect(limiter.check('5.6.7.8').allowed).toBe(true);
  });
});

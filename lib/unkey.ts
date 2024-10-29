import { Ratelimit } from '@unkey/ratelimit'

if (!process.env.UNKEY_API_KEY) {
  throw new Error('UNKEY_API_KEY is not set')
}

export const unkey = new Ratelimit({
  rootKey: process.env.UNKEY_API_KEY,
  namespace: 'quote.generator',
  limit: 5,              // 5 requests allowed
  duration: '1m',        // per 1 minute
  async: true,
})
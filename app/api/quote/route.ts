import { unkey } from '@/lib/unkey'
import { NextRequest, NextResponse } from 'next/server'

const quotes = [
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" }
]

const getClientIp = (req: NextRequest): string => {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)

  const rateLimitResponse = await unkey.limit(ip)

  if (!rateLimitResponse.success) {
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. Please try again later.',
        remaining: 0,
        reset: rateLimitResponse.reset
      }, 
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResponse.reset.toString()
        }
      }
    )
  }

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return NextResponse.json(
    { 
      ...randomQuote,
      remaining: rateLimitResponse.remaining,
      reset: rateLimitResponse.reset
    },
    {
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': rateLimitResponse.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResponse.reset.toString()
      }
    }
  )
}
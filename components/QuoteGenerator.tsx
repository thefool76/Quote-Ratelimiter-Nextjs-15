'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useToast } from "@/hooks/use-toast"
import { RefreshCcw, Quote as QuoteIcon, AlertCircle } from 'lucide-react'

interface Quote {
  text: string
  author: string
  remaining: number
  reset: number
}

interface Error {
  error: string
  remaining: number
  reset: number
}

export default function QuoteGenerator() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/quote')
      const data = await response.json()
      
      if (response.status === 429) {
        setError(data)
        setQuote(null)
        toast({
          variant: "destructive",
          title: "Rate Limit Exceeded",
          description: "Please wait a few minutes before trying again.",
        })
      } else {
        setQuote(data)
        setError(null)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError({
        error: 'Failed to fetch quote',
        remaining: 0,
        reset: 0
      })
      setQuote(null)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch quote. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuoteIcon className="h-6 w-6" />
            Random Quote Generator
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {quote && (
            <div className="space-y-4">
              <blockquote className="border-l-4 border-primary pl-4 italic">
                <p className="text-xl font-serif mb-2">{quote.text}</p>
                <footer className="text-sm text-muted-foreground">
                  — {quote.author}
                </footer>
              </blockquote>
              
              <div className="text-sm text-muted-foreground">
                <p>API Calls Remaining: {quote.remaining}</p>
              </div>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.error}
                <p className="text-sm mt-2">Please try again in a few minutes.</p>
              </AlertDescription>
            </Alert>
          )}
          
          {!quote && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <QuoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click the button below to generate a random quote</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-end">
          <Button 
            onClick={fetchQuote} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Generate Quote
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
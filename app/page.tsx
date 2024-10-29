import QuoteGenerator from '@/components/QuoteGenerator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Rate-Limited Quote Generator
        </h1>
        <QuoteGenerator />
      </div>
    </main>
  )
}
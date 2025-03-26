import Link from 'next/link'
import PageContainer from './components/PageContainer'

export default function Home() {
  return (
    <PageContainer className="p-6 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">The Chesseract</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Elevate your chess game with our multidimensional approach to learning and mastery.
        </p>        
      </div>
    </PageContainer>
  )
} 
import ChessBoard from '../components/ChessBoard'
import Link from 'next/link'
import PageContainer from '../components/PageContainer'

export default function Home() {
  return (
    <PageContainer className="p-6 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">The Chesseract</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Elevate your chess game with our multidimensional approach to learning and mastery.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
            Explore Courses
          </button>
          <Link href="/coaches" className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/20 rounded-lg font-bold transition-colors">
            Meet Our Coaches
          </Link>
        </div>
        
        <div className="p-6 glassmorphism rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to a New Dimension of Chess Training</h2>
          <p className="mb-6">
            The Chesseract offers comprehensive chess training for players of all levels. Our approach combines 
            traditional chess wisdom with modern learning techniques, creating a multidimensional experience 
            that accelerates your progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Expert Coaches</h3>
              <p>Learn from international masters and grandmasters with proven teaching methods.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Structured Courses</h3>
              <p>Follow carefully designed curricula that build your skills systematically and effectively.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
              <p>Engage with dynamic content that adapts to your strengths and addresses your weaknesses.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 
import PageContainer from '../../components/PageContainer';
import Image from 'next/image';
import Link from 'next/link';

// import About from '../components/About';
// import PageContainer from '../components/PageContainer';

// export default function AboutPage() {
//   return (
//     <PageContainer className="bg-gray-900 text-white">
//       <About />
//     </PageContainer>
//   );
// } 

export default function AboutPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About The Chesseract</h1>
          <p className="text-xl text-gray-300 mb-8">
            Revolutionizing chess education through innovative learning approaches and world-class instruction.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-black/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glassmorphism rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                At The Chesseract, we believe that every player has the potential to master the game of chess. 
                Our mission is to make high-quality chess education accessible to everyone, from beginners to advanced players.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-400">Cutting-edge learning tools and methods</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-gray-400">World-class instruction and curriculum</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-indigo-600/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-400">Supportive learning environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose The Chesseract?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Expert Instruction</h3>
              <p className="text-gray-300">
                Learn from International Masters and Grandmasters with proven teaching methods and extensive experience.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Personalized Learning</h3>
              <p className="text-gray-300">
                Tailored curriculum that adapts to your skill level and learning style for optimal improvement.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Interactive Platform</h3>
              <p className="text-gray-300">
                Engage with dynamic content, practice exercises, and real-time feedback to enhance your learning.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Global Community</h3>
              <p className="text-gray-300">
                Connect with chess enthusiasts worldwide, participate in tournaments, and share your progress.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join The Chesseract today and take your chess game to the next level.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/courses" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
              >
                Explore Courses
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/20 rounded-lg font-bold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 
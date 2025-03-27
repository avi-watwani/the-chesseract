import PageContainer from '../components/PageContainer';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <PageContainer className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Learn Section */}
        <section className="mb-32">
          <div className="relative">
            <h2 className="text-8xl font-bold text-zinc-900 opacity-10 absolute -top-10 left-0">
              Learn
            </h2>
            <div className="bg-white text-black rounded-3xl p-8 flex items-center justify-between overflow-hidden">
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold mb-4">Elevate Your Chess:</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Unleashing Mastery Via Diverse Learning Methods
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Unleash Your Potential With Chess Education That Fuses Innovation And Tradition. Our Methodology Combines Varied Techniques To Simplify Learning, Nurturing A Strategic Mindset That Ensures Your Growth As A Confident And Skilled Chess Player.
                </p>
                <Link 
                  href="/learn" 
                  className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Elevate My Game
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <div className="relative w-80 h-80">
                <Image
                  src="/images/chess-piece-learn.png"
                  alt="Chess Learning"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Chess Learning Cards */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">Understand The King's Indian Defense.</h4>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl col-span-1 hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">Master Queen's Gambit</h4>
              <div className="relative w-full h-48 mt-4">
                <Image
                  src="/images/queens-gambit.png"
                  alt="Queen's Gambit"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">Inquisitive About Zugzwang Moves?</h4>
            </div>
          </div>
        </section>

        {/* Course Levels Section */}
        <section className="mb-32">
          <div className="grid grid-cols-3 gap-8">
            {/* Intermediate Level Card */}
            <div className="bg-white text-black rounded-3xl p-12 hover:shadow-xl transition-shadow flex flex-col min-h-[800px]">
              <div>
                <h3 className="text-3xl font-bold mb-3">Intermediate</h3>
                <p className="text-gray-600 mb-8 text-lg">For players ready to enhance their strategic thinking</p>
                
                <div className="mb-8">
                  <div className="flex items-baseline mb-2">
                    <span className="text-gray-400 text-sm line-through">$299.00</span>
                    <span className="ml-2 text-purple-600 text-sm font-medium">SAVE 75%</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">$149</span>
                    <span className="text-gray-600 ml-2">/mo</span>
                  </div>
                </div>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Advanced opening strategies</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Middlegame tactics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">1-on-1 coaching sessions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Full video library access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Weekly progress analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Tournament entry guidance</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 px-6 rounded-xl border-2 border-purple-600 text-purple-600 font-medium hover:bg-purple-600 hover:text-white transition-colors text-lg">
                  Book a Demo
                </button>
              </div>
            </div>

            {/* Basic Level Card */}
            <div className="bg-purple-600 text-white rounded-3xl p-12 hover:shadow-xl transition-shadow flex flex-col min-h-[800px] relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-3">Basic</h3>
                <p className="text-purple-200 mb-8 text-lg">Perfect for beginners starting their chess journey</p>
                
                <div className="mb-8">
                  <div className="flex items-baseline mb-2">
                    <span className="text-purple-300 text-sm line-through">$199.00</span>
                    <span className="ml-2 text-white text-sm font-medium">SAVE 65%</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">$69</span>
                    <span className="text-purple-200 ml-2">/mo</span>
                  </div>
                </div>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Fundamental chess principles</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Basic openings & tactics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Weekly group sessions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Access to basic video library</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Monthly progress tracking</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 px-6 rounded-xl bg-white text-purple-600 font-medium hover:bg-purple-50 transition-colors text-lg">
                  Book a Demo
                </button>
              </div>
            </div>

            {/* Advanced Level Card */}
            <div className="bg-white text-black rounded-3xl p-12 hover:shadow-xl transition-shadow flex flex-col min-h-[800px]">
              <div>
                <h3 className="text-3xl font-bold mb-3">Advanced</h3>
                <p className="text-gray-600 mb-8 text-lg">For serious players aiming for mastery</p>
                
                <div className="mb-8">
                  <div className="flex items-baseline mb-2">
                    <span className="text-gray-400 text-sm line-through">$499.00</span>
                    <span className="ml-2 text-purple-600 text-sm font-medium">SAVE 64%</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">$249</span>
                    <span className="text-gray-600 ml-2">/mo</span>
                  </div>
                </div>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Professional game analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Tournament preparation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Personalized training plan</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Priority 1-on-1 sessions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Advanced strategy workshops</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg">Exclusive GM masterclasses</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full py-4 px-6 rounded-xl border-2 border-purple-600 text-purple-600 font-medium hover:bg-purple-600 hover:text-white transition-colors text-lg">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Play Section */}
        <section className="mb-32">
          <div className="relative">
            <h2 className="text-8xl font-bold text-zinc-900 opacity-10 absolute -top-10 left-0">
              Play
            </h2>
            <div className="bg-white text-black rounded-3xl p-8 flex items-center justify-between overflow-hidden">
              <div className="relative w-96 h-72">
                <Image
                  src="/images/chess-play.png"
                  alt="Play Chess"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold mb-4">Play Chess Like Never Before:</h3>
                <p className="text-gray-600 mb-4">
                  Experience Various Modes With Chesseract!
                </p>
                <p className="text-gray-600 mb-8">
                  Experience Chess At Its Finest With The Chesseract. Engage In Classic, Blitz, And Puzzle Modes, Each Designed To Challenge And Entertain. Delve Into An Exciting World Of Strategy And Intellect As You Hone Your Skills And Compete With Players From Around The Globe.
                </p>
                <Link 
                  href="/play" 
                  className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Let's Go
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Chess Stories Cards */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">The Chess Wizard: Bobby Fischer's Rise And Fall.</h4>
              <span className="text-sm text-gray-400">#ChessStory #BobbyFischer</span>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">Magnus Carlsen Epic Win</h4>
              <div className="relative w-full h-48 mt-4">
                <Image
                  src="/images/magnus-carlsen.png"
                  alt="Magnus Carlsen"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <span className="text-sm text-gray-400">#ChessStory #MagnusCarlsen</span>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
              <h4 className="text-xl font-semibold mb-2">From Prodigy To Pariah: Garry Kasparov's Grand Chess Battles</h4>
              <span className="text-sm text-gray-400">#ChessStory #GarryKasparov</span>
            </div>
          </div>
        </section>

        {/* Shop Section */}
        <section className="mb-32">
          <div className="relative">
            <h2 className="text-8xl font-bold text-zinc-900 opacity-10 absolute -top-10 left-0">
              Shop
            </h2>
            <div className="bg-white text-black rounded-3xl p-8">
              <h3 className="text-3xl font-bold mb-8">Buy World Class Chess Goodies</h3>
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-gray-100 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-4">The Chesseract Board</h4>
                  <div className="relative w-full h-48 mb-4">
                    <div className="bg-gray-200 w-full h-full rounded-lg animate-pulse"></div>
                  </div>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Buy Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gray-100 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-4">The Chesseract Tee</h4>
                  <div className="relative w-full h-48 mb-4">
                    <div className="bg-gray-200 w-full h-full rounded-lg animate-pulse"></div>
                  </div>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Buy Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gray-100 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-4">The Chesseract Badges</h4>
                  <div className="relative w-full h-48 mb-4">
                    <div className="bg-gray-200 w-full h-full rounded-lg animate-pulse"></div>
                  </div>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Buy Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
} 
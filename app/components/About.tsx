'use client'

import { Trophy, Target, BookOpen, BrainCircuit } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: <Trophy className="h-10 w-10 text-primary-blue" />,
      title: "Expert Coaches",
      description: "Learn from international masters and grandmasters with decades of competitive experience."
    },
    {
      icon: <Target className="h-10 w-10 text-primary-blue" />,
      title: "Tailored Approach",
      description: "Personalized training plans adapted to your current level and improvement goals."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary-blue" />,
      title: "Comprehensive Resources",
      description: "Access our extensive library of lessons, puzzles, and annotated games for continuous learning."
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary-blue" />,
      title: "Multidimensional Thinking",
      description: "Develop advanced pattern recognition and strategic thinking skills through our unique methodology."
    }
  ]

  return (
    <section id="about" className="py-12 bg-gradient-to-b from-secondary-black to-secondary-black/90 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">About The Chesseract</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            At The Chesseract, we approach chess training from multiple dimensions, 
            recognizing that mastery requires more than just memorizing openings or tactics. 
            Our academy integrates strategy, psychology, and pattern recognition into a 
            cohesive training system designed to elevate your game to new heights.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <div className="relative group">
              <div className="bg-gradient-to-tr from-primary-blue/30 to-primary-blue-dark/50 p-1.5 rounded-lg shadow-xl transition-transform duration-500 ease-out hover:scale-[1.02]">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/chess-class.jpg')] bg-cover bg-center transform transition-transform duration-700 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-secondary-black/20 transition-opacity duration-300 group-hover:bg-secondary-black/10"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-primary-blue/40 rounded-lg transform rotate-3 transition-all duration-500 group-hover:rotate-6"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary-blue/40 rounded-lg transform -rotate-3 transition-all duration-500 group-hover:-rotate-6"></div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-gradient-to-b from-secondary-black to-secondary-black/80 py-12 px-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-montserrat font-bold text-primary-blue mb-4">Why Choose Us?</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At The Chesseract, we combine tradition with innovation to create a unique learning experience. 
                Our programs are designed to challenge and inspire players of all levels.
              </p>
              <ul className="list-disc list-inside text-gray-300">
                <li>Personalized coaching tailored to your needs</li>
                <li>Access to exclusive resources and tools</li>
                <li>Community-driven learning environment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="mt-16 bg-gradient-to-b from-secondary-black to-secondary-black/80 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glassmorphism rounded-lg p-10 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary-blue mb-6">Our Mission</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  At The Chesseract, we believe that every player has the potential to master the game of chess. 
                  Our mission is to make high-quality chess education accessible to everyone, from beginners to advanced players.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                    <p className="text-gray-400">Cutting-edge learning tools and methods</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
                    <p className="text-gray-400">World-class instruction and curriculum</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-600/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                    <p className="text-gray-400">Supportive learning environment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart Section */}
        <div className="py-12 bg-gradient-to-b from-secondary-black to-secondary-black/90 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6 text-center">What Sets Us Apart</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="glassmorphism p-6 rounded-lg hover-scale">
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="font-montserrat font-bold text-xl mb-2">{feature.title}</h4>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

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
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6">Our Mission</h3>
            <p className="text-gray-300 mb-8">
              We're dedicated to transforming chess education by creating a learning environment 
              that challenges conventional thinking and expands your chess understanding beyond 
              the 64 squares. Like a tesseract expanding a cube into the fourth dimension, 
              we extend your chess comprehension into new realms of strategic thinking.
            </p>
            
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6">What Sets Us Apart</h3>
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
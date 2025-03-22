'use client'

import { ChevronRight } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with chess pattern and gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-black via-secondary-black/80 to-primary-blue-dark/50"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('/images/chess-bg.jpg')] bg-cover bg-center"></div>
        
        {/* Animated chess pieces */}
        <div className="absolute top-1/4 left-1/3 w-16 h-16 opacity-20 animate-float-slow">
          <div className="w-full h-full bg-[url('/images/chess-knight.png')] bg-contain bg-no-repeat"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 opacity-20 animate-float">
          <div className="w-full h-full bg-[url('/images/chess-queen.png')] bg-contain bg-no-repeat"></div>
        </div>
        <div className="absolute top-1/2 right-1/3 w-14 h-14 opacity-20 animate-float-reverse">
          <div className="w-full h-full bg-[url('/images/chess-pawn.png')] bg-contain bg-no-repeat"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            <span className="block">The</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-blue-400 block">Chesseract</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
            Master chess with expert guidance. Explore multidimensional strategies and transform your game through our comprehensive training platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#courses" 
              className="glassmorphism hover-scale bg-primary-blue hover:bg-primary-blue-dark transition-colors text-white py-4 px-8 rounded-md font-semibold flex items-center justify-center space-x-2 text-lg shadow-lg"
            >
              <span>Start Learning Now</span>
              <ChevronRight size={20} />
            </a>
            <a 
              href="#about" 
              className="glassmorphism hover-scale py-4 px-8 rounded-md font-semibold text-white flex items-center justify-center text-lg border border-white/30 hover:border-white/60 transition-colors"
            >
              Discover More
            </a>
          </div>
        </div>
      </div>

      {/* Tesseract-inspired geometric shape in the background */}
      <div className="absolute -right-16 lg:-right-32 top-1/2 transform -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 opacity-30 rotate-45 border-2 border-primary-blue/50 z-0">
        <div className="absolute inset-4 border-2 border-white/30 rotate-12"></div>
        <div className="absolute inset-8 border-2 border-primary-blue/70 -rotate-12"></div>
        <div className="absolute inset-12 border-2 border-white/20 rotate-45"></div>
      </div>
    </section>
  )
}

export default Hero 
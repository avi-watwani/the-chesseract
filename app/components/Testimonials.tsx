'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "James Wilson",
      title: "Amateur Player (1750 FIDE)",
      quote: "The Chesseract transformed my understanding of positional play. Alexandra's clear explanations and personalized feedback helped me gain 200 rating points in just 6 months.",
      image: "/images/testimonial-1.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Elena Petrova",
      title: "Club Player (1950 FIDE)",
      quote: "Michael's tactical training course was exactly what I needed to break through to the next level. The visualization exercises and pattern recognition drills have completely changed my calculation abilities.",
      image: "/images/testimonial-2.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      title: "Junior Player (1600 FIDE)",
      quote: "Sophia's beginner course gave my son a solid foundation in chess fundamentals. Her patient teaching style and engaging exercises kept him motivated and excited to learn more.",
      image: "/images/testimonial-3.jpg",
      rating: 4
    },
    {
      id: 4,
      name: "Sarah Johnson",
      title: "Tournament Player (2100 FIDE)",
      quote: "David's advanced endgame course is worth every penny. His deep analysis and clear instruction on complex positions has significantly improved my conversion rate in winning positions.",
      image: "/images/testimonial-4.jpg",
      rating: 5
    }
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    )
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">What Our Students Say</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-secondary-gray">
            Hear from our students about how The Chesseract has helped them improve their chess 
            skills and achieve their goals through our comprehensive training approach.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Testimonial Navigation */}
            <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-blue hover:bg-primary-blue hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-blue hover:bg-primary-blue hover:text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* Testimonials */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonialsData.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="glassmorphism p-8 md:p-12 rounded-2xl shadow-lg">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0">
                          <div 
                            className="w-full h-full rounded-full bg-cover bg-center" 
                            style={{ backgroundImage: `url(${testimonial.image})` }}
                          ></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} size={20} className="fill-primary-blue text-primary-blue" />
                            ))}
                            {[...Array(5 - testimonial.rating)].map((_, i) => (
                              <Star key={i} size={20} className="text-gray-300" />
                            ))}
                          </div>
                          
                          <blockquote className="text-lg md:text-xl italic text-secondary-gray mb-6">
                            "{testimonial.quote}"
                          </blockquote>
                          
                          <div>
                            <h4 className="font-montserrat font-bold text-xl">{testimonial.name}</h4>
                            <p className="text-secondary-gray">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonialsData.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-primary-blue' : 'bg-gray-300'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="#contact" 
            className="inline-block bg-primary-blue hover:bg-primary-blue-dark text-white py-3 px-8 rounded-md font-semibold transition-colors"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  )
}

export default Testimonials 
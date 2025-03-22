'use client'

import { Twitter, Linkedin, Mail } from 'lucide-react'

const Coaches = () => {
  const coachesData = [
    {
      id: 1,
      name: "Alexandra Reynolds",
      title: "Grandmaster",
      bio: "International Grandmaster with over 20 years of competitive experience and a specialist in positional play and endgames.",
      rating: 2550,
      image: "/images/coach-1.jpg",
      socials: {
        twitter: "#",
        linkedin: "#",
        email: "mailto:alexandra@chesseract.com"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "International Master",
      bio: "A tactical wizard known for dynamic play. Michael specializes in attacking chess and creative middlegame strategies.",
      rating: 2480,
      image: "/images/coach-2.jpg",
      socials: {
        twitter: "#",
        linkedin: "#",
        email: "mailto:michael@chesseract.com"
      }
    },
    {
      id: 3,
      name: "Sophia Torres",
      title: "FIDE Master",
      bio: "Junior training specialist with a structured approach to teaching fundamentals and developing a solid chess foundation.",
      rating: 2350,
      image: "/images/coach-3.jpg",
      socials: {
        twitter: "#",
        linkedin: "#",
        email: "mailto:sophia@chesseract.com"
      }
    },
    {
      id: 4,
      name: "David Karpov",
      title: "Grandmaster",
      bio: "Strategic specialist with expertise in Ruy Lopez and closed positions. Former national champion with extensive teaching experience.",
      rating: 2620,
      image: "/images/coach-4.jpg",
      socials: {
        twitter: "#",
        linkedin: "#",
        email: "mailto:david@chesseract.com"
      }
    }
  ]

  return (
    <section id="coaches" className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Our Expert Coaches</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-secondary-gray">
            Learn from world-class chess coaches with proven track records in competition and teaching. 
            Our instructors bring decades of experience and personalized attention to every lesson.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coachesData.map((coach) => (
            <div 
              key={coach.id} 
              className="glassmorphism hover-scale rounded-xl overflow-hidden shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-72 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: `url(${coach.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-black to-transparent opacity-70"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h3 className="font-montserrat text-xl font-bold">{coach.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-primary-blue font-semibold">{coach.title}</span>
                    <span className="text-sm opacity-80">• FIDE {coach.rating}</span>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <a 
                      href={coach.socials.twitter} 
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-blue flex items-center justify-center transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                    <a 
                      href={coach.socials.linkedin} 
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-blue flex items-center justify-center transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a 
                      href={coach.socials.email} 
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-blue flex items-center justify-center transition-colors"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-secondary-gray">{coach.bio}</p>
                
                <a 
                  href="#contact" 
                  className="mt-6 inline-block font-medium text-primary-blue hover:text-primary-blue-dark transition-colors"
                >
                  Book a session
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#contact" 
            className="inline-block bg-primary-blue hover:bg-primary-blue-dark text-white py-3 px-8 rounded-md font-semibold transition-colors"
          >
            Meet All Coaches
          </a>
        </div>
      </div>
    </section>
  )
}

export default Coaches 
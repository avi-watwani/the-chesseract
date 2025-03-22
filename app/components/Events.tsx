'use client'

import { Calendar, MapPin, Clock, Trophy, ChevronRight } from 'lucide-react'

const Events = () => {
  const eventsData = [
    {
      id: 1,
      title: "Monthly Blitz Tournament",
      description: "Test your skills in our monthly blitz tournament with players of all levels. Prizes for multiple rating categories!",
      date: "December 10, 2023",
      time: "6:00 PM - 9:00 PM",
      location: "The Chesseract Center",
      category: "Tournament",
      image: "/images/event-1.jpg"
    },
    {
      id: 2,
      title: "Master Class: Endgame Techniques",
      description: "Join Grandmaster David Karpov for an intensive workshop focusing on critical endgame positions and winning techniques.",
      date: "December 15, 2023",
      time: "5:30 PM - 8:30 PM",
      location: "Online (Zoom)",
      category: "Workshop",
      image: "/images/event-2.jpg"
    },
    {
      id: 3,
      title: "Weekend Chess Camp for Juniors",
      description: "A two-day intensive training camp for juniors under 14, covering tactics, strategy, and competitive play.",
      date: "January 7-8, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "The Chesseract Center",
      category: "Training Camp",
      image: "/images/event-3.jpg"
    },
    {
      id: 4,
      title: "Winter Chess Championship",
      description: "Our flagship winter tournament with classical time controls. FIDE rated with sections for all rating levels.",
      date: "January 20-22, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Grand Conference Center",
      category: "Championship",
      image: "/images/event-4.jpg"
    }
  ]

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Upcoming Events</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-secondary-gray">
            Participate in our tournaments, workshops, and special events to test your skills, 
            learn from masters, and connect with the chess community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eventsData.map((event) => (
            <div 
              key={event.id} 
              className="glassmorphism hover-scale rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="md:w-2/5 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center h-48 md:h-full" 
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-montserrat text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-secondary-gray mb-6">{event.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-secondary-gray">
                      <Calendar size={18} className="mr-2 text-primary-blue" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-secondary-gray">
                      <Clock size={18} className="mr-2 text-primary-blue" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-secondary-gray">
                      <MapPin size={18} className="mr-2 text-primary-blue" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                <a 
                  href={`#event-${event.id}`} 
                  className="flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold transition-colors"
                >
                  <span>Learn More</span>
                  <ChevronRight size={20} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#events-calendar" 
            className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-blue-dark font-semibold transition-colors"
          >
            <Trophy size={20} />
            <span>View Complete Events Calendar</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Events 
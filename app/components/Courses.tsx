'use client'

import { Clock, Award, Users, BookOpen, ChevronRight } from 'lucide-react'

const Courses = () => {
  const courseData = [
    {
      id: "beginner",
      level: "Beginner",
      title: "Chess Fundamentals",
      description: "Master the basic principles, openings, and endgames essential for building a solid chess foundation.",
      duration: "8 weeks",
      students: "250+",
      lessons: "24 lessons",
      image: "/images/beginner-chess.jpg",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "intermediate",
      level: "Intermediate",
      title: "Tactical Mastery",
      description: "Enhance your tactical awareness, calculation skills, and positional understanding through practical examples.",
      duration: "10 weeks",
      students: "180+",
      lessons: "30 lessons",
      image: "/images/intermediate-chess.jpg",
      color: "from-purple-500 to-blue-500"
    },
    {
      id: "advanced",
      level: "Advanced",
      title: "Strategic Excellence",
      description: "Develop sophisticated strategic concepts, deep positional understanding, and advanced endgame techniques.",
      duration: "12 weeks",
      students: "120+",
      lessons: "36 lessons",
      image: "/images/advanced-chess.jpg",
      color: "from-blue-600 to-indigo-800"
    },
    {
      id: "specialized",
      level: "Specialized",
      title: "Opening Laboratory",
      description: "Deepen your opening repertoire with comprehensive analysis and understand key strategic concepts behind each opening.",
      duration: "8 weeks",
      students: "150+",
      lessons: "24 lessons",
      image: "/images/opening-chess.jpg",
      color: "from-indigo-500 to-purple-700"
    },
    {
      id: "mental",
      level: "Mental Training",
      title: "Chess Psychology",
      description: "Strengthen your mental game, learn to handle pressure, and develop resilience for tournament play.",
      duration: "6 weeks",
      students: "200+",
      lessons: "18 lessons",
      image: "/images/psychology-chess.jpg",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "competition",
      level: "Competition",
      title: "Tournament Preparation",
      description: "Comprehensive preparation for competitive play including time management, opponent preparation, and tournament strategy.",
      duration: "4 weeks",
      students: "90+",
      lessons: "12 lessons",
      image: "/images/tournament-chess.jpg",
      color: "from-cyan-600 to-blue-700"
    }
  ]

  return (
    <section id="courses" className="py-20 bg-secondary-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Our Courses</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-secondary-gray">
            Explore our comprehensive range of courses designed to elevate your chess skills 
            from the fundamentals to advanced concepts. Each course is structured to provide 
            a balance of theory, practice, and personalized feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course) => (
            <div 
              key={course.id} 
              className="glassmorphism hover-scale rounded-xl overflow-hidden shadow-lg transition-all duration-300 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.image})` }}
                ></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-80`}></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-secondary-black px-4 py-1 rounded-full text-sm font-semibold">
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-bold mb-3">{course.title}</h3>
                <p className="text-secondary-gray mb-6">{course.description}</p>
                
                <div className="flex justify-between items-center mb-6 text-sm text-secondary-gray">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    <span>{course.lessons}</span>
                  </div>
                </div>
                
                <a 
                  href={`#${course.id}`} 
                  className="flex justify-between items-center w-full bg-gradient-to-r from-primary-blue to-blue-500 hover:from-primary-blue-dark hover:to-blue-600 text-white py-3 px-6 rounded-md font-semibold transition-all group"
                >
                  <span>Enroll Now</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#contact" 
            className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-blue-dark font-semibold transition-colors"
          >
            <span>View All Courses</span>
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Courses 
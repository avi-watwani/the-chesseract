'use client'

import { Calendar, User, Clock, ChevronRight } from 'lucide-react'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Mastering the Sicilian Defense: Key Concepts",
      excerpt: "Explore the strategic ideas behind the Sicilian Defense and learn how to navigate its complex positions with confidence.",
      author: "Alexandra Reynolds",
      date: "Oct 15, 2023",
      readTime: "8 min read",
      image: "/images/blog-1.jpg",
      category: "Strategy"
    },
    {
      id: 2,
      title: "Tactical Patterns Every Player Should Know",
      excerpt: "Discover the most common tactical patterns that appear in games at all levels and how to spot them in your own games.",
      author: "Michael Chen",
      date: "Nov 2, 2023",
      readTime: "10 min read",
      image: "/images/blog-2.jpg",
      category: "Tactics"
    },
    {
      id: 3,
      title: "Endgame Principles: Rook Endgames Simplified",
      excerpt: "Learn the fundamental principles of rook endgames and how to apply them in practical situations to secure the win.",
      author: "David Karpov",
      date: "Nov 18, 2023",
      readTime: "12 min read",
      image: "/images/blog-3.jpg",
      category: "Endgames"
    }
  ]

  return (
    <section id="blog" className="py-20 bg-secondary-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Chess Insights Blog</h2>
          <div className="w-20 h-1 bg-primary-blue mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-secondary-gray">
            Expand your chess knowledge through our collection of articles, videos, 
            and puzzles crafted by our expert coaches to help you improve your game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="glassmorphism hover-scale rounded-xl overflow-hidden shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${post.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-black/70 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-montserrat text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-secondary-gray mb-6">{post.excerpt}</p>
                
                <div className="flex flex-wrap items-center justify-between mb-6 text-sm text-secondary-gray">
                  <div className="flex items-center mr-4 mb-2">
                    <User size={16} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <Calendar size={16} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Clock size={16} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <a 
                  href={`#blog-${post.id}`} 
                  className="flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold transition-colors"
                >
                  <span>Read More</span>
                  <ChevronRight size={20} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#blog-archive" 
            className="inline-block bg-primary-blue hover:bg-primary-blue-dark text-white py-3 px-8 rounded-md font-semibold transition-colors"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  )
}

export default Blog 
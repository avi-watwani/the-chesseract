import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '../../components/PageContainer';

// Coach type definition (same as in coaches/page.tsx)
type Coach = {
  id: string;
  name: string;
  rating: number;
  fideRating?: number;
  title: string;
  shortBio: string;
  longBio: string;
  image: string;
  achievements?: string[];
};

// Mock data for coaches (same as in coaches/page.tsx)
const coaches: Coach[] = [
  {
    id: "anna-smith",
    name: "Anna Smith",
    rating: 2450,
    fideRating: 2380,
    title: "International Master",
    shortBio: "Former national champion with 15+ years of teaching experience",
    longBio: "Anna Smith is an International Master who has represented her country in multiple Chess Olympiads. With over 15 years of teaching experience, she specializes in positional play and endgame techniques. Her students have gone on to win numerous national and international youth championships. Anna's teaching philosophy emphasizes understanding the strategic elements of chess positions before diving into tactical solutions. She believes that a strong strategic foundation leads to more consistent performance and deeper chess understanding.",
    image: "/images/coach-1.jpg",
    achievements: ["Top 50 in Women's Rankings", "Coach of 2 National Teams"]
  },
  {
    id: "david-johnson",
    name: "David Johnson",
    rating: 2650,
    fideRating: 2610,
    title: "Grandmaster",
    shortBio: "Renowned opening expert and attacking specialist",
    longBio: "Grandmaster David Johnson is a renowned opening theory expert and attacking specialist. He has competed at the highest level in international tournaments and has coached several grandmasters. David's teaching approach focuses on understanding the principles behind moves rather than memorizing variations. His students consistently praise his ability to simplify complex positions and provide actionable advice for players of all levels. David has authored three books on aggressive chess play and dynamic sacrifices.",
    image: "/images/coach-2.jpg",
    achievements: ["Founder of Chess Academy", "Top 100 in World Rankings"]
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    rating: 2350,
    fideRating: 2290,
    title: "FIDE Master",
    shortBio: "Specializes in beginner to intermediate skill development",
    longBio: "Sophia Chen is a FIDE Master who specializes in teaching beginners and intermediate players. Her structured curriculum and patient teaching style make complex concepts accessible to players of all ages. Sophia is passionate about introducing more people to the beautiful game of chess. She has developed a series of progressive lessons that build fundamental skills in a logical sequence, ensuring that students develop a solid foundation. Sophia's approach emphasizes pattern recognition and visualization exercises that strengthen chess intuition.",
    image: "/images/coach-3.jpg",
    achievements: ["Youth Chess Ambassador", "Best Chess Educator Award"]
  },
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    rating: 2550,
    fideRating: 2510,
    title: "International Master",
    shortBio: "Tactical genius with expertise in complex middlegame positions",
    longBio: "International Master Michael Rodriguez is known for his tactical prowess and deep understanding of complex middlegame positions. He has authored several chess books and created popular chess courses. Michael's energetic teaching style keeps students engaged while presenting sophisticated concepts. He specializes in teaching calculation techniques and visualization skills that help players find tactical opportunities consistently. Michael's training program includes intensive tactical exercises designed to sharpen pattern recognition and improve decision-making under pressure.",
    image: "/images/coach-4.jpg",
    achievements: ["Author of 5 Chess Books", "Online Chess Content Creator"]
  },
  {
    id: "elena-petrova",
    name: "Elena Petrova",
    rating: 2750,
    fideRating: 2690,
    title: "Grandmaster",
    shortBio: "Former World Championship Candidate with strategic mastery",
    longBio: "Grandmaster Elena Petrova is a former World Championship Candidate known for her strategic mastery and endgame technique. She has coached national teams and elite players. Elena's analytical approach helps students develop a deep understanding of chess principles and improve their decision-making process. Her specialty is transforming small advantages into decisive wins through precise technique. Elena's teaching methodology emphasizes positional understanding and creating comprehensive game plans that extend from the opening through the endgame.",
    image: "/images/coach-5.jpg",
    achievements: ["World Championship Candidate", "Coach of Olympic Gold Team"]
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    rating: 2400,
    fideRating: 2360,
    title: "International Master",
    shortBio: "Chess psychologist focused on mental training and competition preparation",
    longBio: "International Master James Wilson combines his chess expertise with a background in sports psychology. He specializes in mental training, competition preparation, and overcoming psychological barriers in chess. James has helped numerous players overcome performance anxiety and reach their full potential. His holistic approach addresses both technical chess skills and the psychological aspects that influence performance. James works with players to develop pre-game routines, time management strategies, and mental resilience techniques that lead to consistent results in tournament play.",
    image: "/images/coach-6.jpg",
    achievements: ["Chess Psychology Pioneer", "Mental Training Specialist"]
  }
];

export default function CoachPage({ params }: { params: { id: string } }) {
  // Find the coach with the matching ID
  const coach = coaches.find(c => c.id === params.id);
  
  // If coach doesn't exist, return 404
  if (!coach) {
    notFound();
  }
  
  return (
    <PageContainer className="pb-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <Link href="/coaches" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Coaches
        </Link>

        <div className="glassmorphism rounded-xl overflow-hidden">
          <div className="text-center pt-8 pb-4">
            <h2 className="text-2xl font-bold">Meet Your Mentor</h2>
          </div>
          
          <div className="lg:flex">
            {/* Coach Image and Info (Left Column) */}
            <div className="lg:w-1/3 p-8 flex flex-col items-center">
              <div className="aspect-square w-64 h-64 relative rounded-full overflow-hidden bg-gray-800 mb-6 border-4 border-blue-500/30">
                {/* Placeholder for coach image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2 text-center">
                {coach.title === "Grandmaster" ? "GM" : coach.title === "International Master" ? "IM" : "FM"} {coach.name}
              </h1>
              <h2 className="text-xl text-gray-300 mb-6 text-center">{coach.title}</h2>
              
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <div className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full text-center">
                  USCF rating - {coach.rating}
                </div>
                {coach.fideRating && (
                  <div className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full text-center">
                    FIDE rating - {coach.fideRating}
                  </div>
                )}
                
                {coach.achievements?.map((achievement, index) => (
                  <div key={index} className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full text-center">
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Coach Details (Right Column) */}
            <div className="lg:w-2/3 p-8 border-t lg:border-t-0 lg:border-l border-gray-700">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Biography</h3>
                <p className="text-gray-300 leading-relaxed">{coach.longBio}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Specialties</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCoachSpecialties(coach.id).map((specialty, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{specialty}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Available Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getCoachCourses(coach.id).map((course, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700">
                      <h4 className="font-semibold mb-1">{course.title}</h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">{course.level}</span>
                        <span className="text-sm font-semibold">${course.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a href="#" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Book a Session
                </a>
                <a href="#" className="px-6 py-3 bg-transparent border border-white/20 hover:bg-white/10 rounded-lg transition-colors">
                  View Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// Helper function to get coach specialties (mock data)
function getCoachSpecialties(coachId: string): string[] {
  const specialtiesMap: Record<string, string[]> = {
    "anna-smith": [
      "Positional Play", 
      "Endgame Technique", 
      "Opening Preparation", 
      "Strategic Planning",
      "Tournament Preparation"
    ],
    "david-johnson": [
      "Opening Theory", 
      "Attacking Chess", 
      "Tactical Patterns", 
      "Dynamic Sacrifices",
      "Pawn Structure Analysis"
    ],
    "sophia-chen": [
      "Beginner Fundamentals", 
      "Basic Tactics", 
      "Endgame Essentials", 
      "Chess Notation",
      "Learning Methodology"
    ],
    "michael-rodriguez": [
      "Tactical Combinations", 
      "Calculation Training", 
      "Complex Middlegames", 
      "Attack and Defense",
      "Pattern Recognition"
    ],
    "elena-petrova": [
      "Strategic Play", 
      "Endgame Mastery", 
      "Positional Sacrifices", 
      "Long-term Planning",
      "Converting Advantages"
    ],
    "james-wilson": [
      "Mental Training", 
      "Competition Psychology", 
      "Time Management", 
      "Decision Making",
      "Focus and Concentration"
    ]
  };
  
  return specialtiesMap[coachId] || [];
}

// Helper function to get coach courses (mock data)
function getCoachCourses(coachId: string): Array<{title: string, level: string, price: number}> {
  const coursesMap: Record<string, Array<{title: string, level: string, price: number}>> = {
    "anna-smith": [
      {title: "Mastering the Endgame", level: "Intermediate", price: 149},
      {title: "Positional Chess Secrets", level: "Advanced", price: 199},
      {title: "Strategic Decision Making", level: "All Levels", price: 129}
    ],
    "david-johnson": [
      {title: "Aggressive Chess Tactics", level: "Intermediate", price: 179},
      {title: "Dynamic Opening Play", level: "Advanced", price: 229},
      {title: "Practical Attacking Skills", level: "All Levels", price: 149}
    ],
    "sophia-chen": [
      {title: "Chess Fundamentals", level: "Beginner", price: 99},
      {title: "Basic Tactical Patterns", level: "Beginner", price: 109},
      {title: "From Beginner to Intermediate", level: "Beginner", price: 129}
    ],
    "michael-rodriguez": [
      {title: "Tactical Vision Training", level: "Intermediate", price: 169},
      {title: "Calculation Masterclass", level: "Advanced", price: 219},
      {title: "Winning Tactical Patterns", level: "All Levels", price: 149}
    ],
    "elena-petrova": [
      {title: "Strategic Mastery", level: "Advanced", price: 199},
      {title: "Dominating the Endgame", level: "Advanced", price: 219},
      {title: "Positional Decision Making", level: "Intermediate", price: 179}
    ],
    "james-wilson": [
      {title: "Chess Psychology", level: "All Levels", price: 149},
      {title: "Tournament Success", level: "Intermediate", price: 179},
      {title: "Mental Toughness Training", level: "Advanced", price: 199}
    ]
  };
  
  return coursesMap[coachId] || [];
} 
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageContainer from '../../../components/PageContainer';

// Coach type definition (same as in coaches/page.tsx)
type Coach = {
  id: string;
  name: string;
  rating: number;
  fideRating?: number;
  title: string;
  title_short: string;
  shortBio: string;
  longBio: string[];
  image: string;
  achievements?: string[];
};

// Mock data for coaches (same as in coaches/page.tsx)
const coaches: Coach[] = [
  {
    id: "avi-watwani",
    name: "Avi Watwani",
    rating: 2101,
    fideRating: 2014,
    title: "International Master",
    title_short: "IM",
    shortBio: "Winner of multiple online tournaments",
    longBio: [
      "Avi Watwani is a professional chess player and coach with over 12 years of experience in the game. Holding a 2000+ rating on major online chess platforms, he ranks among the top 10% of players worldwide.",
      "Over the years, Avi has participated in and won multiple online tournaments, developing a deep understanding of the strategic and psychological aspects of chess.",
      "For the past four years, he has been mentoring young players aged 5 to 15 years, helping them strengthen their foundations in openings, tactics, endgames, and overall chess understanding.",
      "Passionate about teaching, Avi focuses on making chess both fun and intellectually stimulating for his students — guiding them from beginner concepts to advanced competitive preparation.",
      "He firmly believes that \"in chess, with every game played — win or lose — you are one move closer to greatness.\""
    ],
    image: "/images/coach-1.jpg",
    achievements: ["Founder of Chess Academy", "Top 10% in the world"]
  },
  {
    id: "placeholder-1",
    name: "John Doe",
    rating: 2750,
    fideRating: 2610,
    title: "Grandmaster",
    title_short: "GM",
    shortBio: "Renowned opening expert and attacking specialist",
    longBio: [
      "Grandmaster John Doe is a renowned opening theory expert and attacking specialist. He has competed at the highest level in international tournaments and has coached several grandmasters.",
      "John's teaching approach focuses on understanding the principles behind moves rather than memorizing variations."
    ],
    image: "/images/coach-2.jpg",
    achievements: ["Duke University Chess Team Captain", "Finalist in the World Open Chess Championship"]
  }
];

type Props = {
  params: {
    id: string;
  };
};

export default async function CoachPage({ params }: Props) {
  const coachId = params.id;

    // Find the coach with the matching ID
    const coach = coaches.find((c) => c.id === coachId);
  
  // If coach doesn't exist, return 404
  if (!coach) {
    notFound();
  }
  
  return (
    <PageContainer className="pb-16 bg-gradient-to-b from-gray-900 to-black text-white mt-8">
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
                {coach.title_short}{coach.id.startsWith('avi-') && <sup>*</sup>} {coach.name}
              </h1>
              <div className="text-gray-300 mb-4 text-center">{coach.title}{coach.id.startsWith('avi-') && <sup>*</sup>}</div>
              
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
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Biography</h3>
                <div className="space-y-4">
                  {coach.longBio.map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
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
    "avi-watwani": [
      "Positional Play", 
      "Endgame Technique", 
      "Opening Preparation", 
      "Strategic Planning",
      "Tournament Preparation"
    ],
    "placeholder-1": [
      "Opening Theory", 
      "Attacking Chess", 
      "Tactical Patterns", 
      "Dynamic Sacrifices",
      "Pawn Structure Analysis"
    ]
  };
  
  return specialtiesMap[coachId] || [];
}

// Helper function to get coach courses (mock data)
function getCoachCourses(coachId: string): Array<{title: string, level: string, price: number}> {
  const coursesMap: Record<string, Array<{title: string, level: string, price: number}>> = {
    "avi-watwani": [
      {title: "Mastering the Endgame", level: "Intermediate", price: 149},
      {title: "Positional Chess Secrets", level: "Advanced", price: 199},
      {title: "Strategic Decision Making", level: "All Levels", price: 129}
    ],
    "placeholder-1": [
      {title: "Aggressive Chess Tactics", level: "Intermediate", price: 179},
      {title: "Dynamic Opening Play", level: "Advanced", price: 229},
      {title: "Practical Attacking Skills", level: "All Levels", price: 149}
    ]
  };
  
  return coursesMap[coachId] || [];
} 
import Link from 'next/link';
import Image from 'next/image';
import PageContainer from '../components/PageContainer';

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

// Mock data for coaches
const coaches: Coach[] = [
  {
    id: "anna-smith",
    name: "Anna Smith",
    rating: 2450,
    fideRating: 2380,
    title: "International Master",
    shortBio: "Former national champion with 15+ years of teaching experience",
    longBio: "Anna Smith is an International Master who has represented her country in multiple Chess Olympiads. With over 15 years of teaching experience, she specializes in positional play and endgame techniques. Her students have gone on to win numerous national and international youth championships.",
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
    longBio: "Grandmaster David Johnson is a renowned opening theory expert and attacking specialist. He has competed at the highest level in international tournaments and has coached several grandmasters. David's teaching approach focuses on understanding the principles behind moves rather than memorizing variations.",
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
    longBio: "Sophia Chen is a FIDE Master who specializes in teaching beginners and intermediate players. Her structured curriculum and patient teaching style make complex concepts accessible to players of all ages. Sophia is passionate about introducing more people to the beautiful game of chess.",
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
    longBio: "International Master Michael Rodriguez is known for his tactical prowess and deep understanding of complex middlegame positions. He has authored several chess books and created popular chess courses. Michael's energetic teaching style keeps students engaged while presenting sophisticated concepts.",
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
    longBio: "Grandmaster Elena Petrova is a former World Championship Candidate known for her strategic mastery and endgame technique. She has coached national teams and elite players. Elena's analytical approach helps students develop a deep understanding of chess principles and improve their decision-making process.",
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
    longBio: "International Master James Wilson combines his chess expertise with a background in sports psychology. He specializes in mental training, competition preparation, and overcoming psychological barriers in chess. James has helped numerous players overcome performance anxiety and reach their full potential.",
    image: "/images/coach-6.jpg",
    achievements: ["Chess Psychology Pioneer", "Mental Training Specialist"]
  }
];

export default function CoachesPage() {
  return (
    <PageContainer className="pb-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Our Chess Coaches</h1>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Train with our world-class chess coaches. From beginners to advanced players,
          our coaches have the expertise to take your game to the next level.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map(coach => (
            <Link 
              href={`/coaches/${coach.id}`} 
              key={coach.id} 
              className="glassmorphism rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="text-center pt-6 pb-2">
                <h2 className="text-xl font-bold">Meet Your Mentor</h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="aspect-square w-40 h-40 relative rounded-full overflow-hidden bg-gray-800 mb-4">
                  {/* Placeholder for coach image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1 text-center">
                  {coach.title === "Grandmaster" ? "GM" : coach.title === "International Master" ? "IM" : "FM"} {coach.name}
                </h3>
                <div className="text-gray-300 mb-4 text-center">{coach.title}</div>
                
                <div className="flex flex-col gap-2 w-full">
                  <div className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full text-center">
                    USCF rating - {coach.rating}
                  </div>
                  {coach.fideRating && (
                    <div className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full text-center">
                      FIDE rating - {coach.fideRating}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 mb-2">
                  {coach.achievements && coach.achievements.slice(0, 1).map((achievement, index) => (
                    <div key={index} className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full text-center">
                      {achievement}
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-300 text-center text-sm mt-4">{coach.shortBio}</p>
                <div className="mt-5 w-full">
                  <span className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium">
                    View Profile
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link href="/#contact" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
            Book a Session
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 
import PageContainer from '../../components/PageContainer';

export default function BlogPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">The Chesseract Blog</h1>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Stay updated with the latest chess strategies, tournament news, and expert insights.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="glassmorphism p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              We're preparing a collection of high-quality chess content to help you improve your game. 
              Our blog will feature:
            </p>
            <ul className="text-left text-gray-300 space-y-2 mb-8 list-disc list-inside">
              <li>Game Analysis from Top Players</li>
              <li>Opening Theory and Preparation</li>
              <li>Tactical Puzzles and Solutions</li>
              <li>Strategic Concepts and Planning</li>
              <li>Tournament Preparation Tips</li>
            </ul>
            <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Check Back Soon!
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 
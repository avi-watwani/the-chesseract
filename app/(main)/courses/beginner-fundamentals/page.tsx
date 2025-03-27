export default function BeginnerFundamentals() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8">Beginner Fundamentals</h1>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700">
          <p className="text-gray-200 text-lg mb-8">
            Master the essential concepts and rules of chess. This course is perfect for beginners
            who want to build a strong foundation in chess.
          </p>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">What you'll learn:</h2>
            <ul className="list-none space-y-4 text-lg">
              <li className="flex items-center text-gray-200">
                <span className="mr-3">•</span>Basic rules and piece movements
              </li>
              <li className="flex items-center text-gray-200">
                <span className="mr-3">•</span>Understanding the chessboard
              </li>
              <li className="flex items-center text-gray-200">
                <span className="mr-3">•</span>Basic checkmate patterns
              </li>
              <li className="flex items-center text-gray-200">
                <span className="mr-3">•</span>Opening principles
              </li>
              <li className="flex items-center text-gray-200">
                <span className="mr-3">•</span>Basic tactics and strategies
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
import PageContainer from '../../components/PageContainer';
import PlayChess from '../../components/PlayChess';

export default function PlayPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Play Chess Online</h1>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-8">
          Challenge players from around the world and improve your game in real-time matches.
        </p>
        <PlayChess />
      </div>
    </PageContainer>
  );
} 
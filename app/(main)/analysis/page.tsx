import PageContainer from '../../components/PageContainer';
import Image from 'next/image';
import Link from 'next/link';

export default function AnalysisPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Analysis Board</h1>
          <p className="text-xl text-gray-300 mb-8">
            Analyze your games with our powerful analysis board.
          </p>
        </div>
    </PageContainer>
  );
}

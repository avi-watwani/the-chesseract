import PageContainer from '../../components/PageContainer';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Board Editor</h1>
            <p className="text-xl text-gray-300 mb-8">
            Create and edit your own custom boards with our easy-to-use editor.
            </p>
            <div className="flex justify-center mb-8">
            <Image
                src="/images/editor.png"
                alt="Board Editor"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
            />
            </div>
            <Link href="/editor/create" className="text-blue-500 hover:underline">
            Start Creating Your Board
            </Link>
        </div>
    </PageContainer>
  );
}

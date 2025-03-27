import PageContainer from '../../components/PageContainer';
import Image from 'next/image';

export default function ShopPage() {
  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">The Chesseract Shop</h1>
          <p className="text-xl text-gray-300 mb-12">
            Get ready for our exclusive collection of chess merchandise and training materials.
          </p>

          <div className="glassmorphism rounded-2xl p-8 mb-12">
            <div className="relative w-64 h-64 mx-auto mb-8">
              <Image
                src="/images/chess-class.jpg"
                alt="Chess Shop Coming Soon"
                fill
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/40 rounded-xl" />
            </div>

            <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
            <p className="text-gray-300 mb-8">
              We're preparing an exciting collection of products to enhance your chess journey. 
              Our shop will feature:
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Premium Chess Sets</h3>
                  <p className="text-gray-400 text-sm">Beautifully crafted chess sets for all skill levels</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Training Materials</h3>
                  <p className="text-gray-400 text-sm">Comprehensive study guides and workbooks</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Chesseract Merch</h3>
                  <p className="text-gray-400 text-sm">Stylish apparel and accessories</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Digital Resources</h3>
                  <p className="text-gray-400 text-sm">Premium video content and software</p>
                </div>
              </div>
            </div>

            <div className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
              Coming Soon!
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            Sign up for our newsletter to be notified when the shop launches
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 
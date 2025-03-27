import Link from 'next/link'
import Image from 'next/image'

export default function Login() {
  return (
    <div className="flex min-h-screen bg-black relative">
      {/* Home Button */}
      <div className="fixed top-8 right-8 z-50">
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </div>

      {/* Left side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-white">
        <Image 
          src="/images/sign-in.png"
          alt="Chess Login"
          fill
          className="object-contain p-12"
          priority
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Login To Chesseract
          </h1>

          <form className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-white text-base hover:opacity-80 transition-opacity"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black text-lg font-medium py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>

          <div className="text-center">
            <Link 
              href="/signup" 
              className="text-white text-base hover:opacity-80 transition-opacity"
            >
              New To Chesseract? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
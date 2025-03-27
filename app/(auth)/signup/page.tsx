import Link from 'next/link'
import Image from 'next/image'

export default function SignUp() {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-white">
        <Image 
          src="/images/sign-up.png"
          alt="Chess Sign Up"
          fill
          className="object-contain p-12"
          priority
        />
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Join Chesseract
          </h1>

          <form className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70"
                />
              </div>

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
                  placeholder="Create Password"
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black text-lg font-medium py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>
          </form>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-white text-base hover:opacity-80 transition-opacity"
            >
              Already Have An Account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
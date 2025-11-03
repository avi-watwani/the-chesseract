'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          setError('An account with this email already exists')
          setLoading(false)
          return
        }

        setSuccess(true)
        // If email confirmation is required, show success message
        // Otherwise redirect to home
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

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

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-xl">
              Account created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading || success}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-white text-black text-lg font-medium py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
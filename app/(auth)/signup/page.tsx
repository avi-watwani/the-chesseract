'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateUsername = (username: string): boolean => {
    // Must start with a letter
    // Can contain letters, numbers, underscore, hyphen
    // Can't end with underscore or hyphen
    // Can't start with numbers
    const usernameRegex = /^[a-zA-Z]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/
    return usernameRegex.test(username)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      // Validate username format
      if (!validateUsername(username)) {
        setError('Username must start with a letter, contain only letters, numbers, hyphens and underscores, and cannot end with hyphen or underscore')
        setLoading(false)
        return
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters')
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Check if username is already taken (case-insensitive)
      // Fetch all usernames and compare client-side to avoid LIKE wildcard issues with _ and %
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('username')
      
      // Check if any username matches case-insensitively
      const usernameExists = allProfiles?.some(
        (profile) => profile.username.toLowerCase() === username.toLowerCase()
      )
      
      if (usernameExists) {
        setError('Username is already taken')
        setLoading(false)
        return
      }

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // Preserve original case for display
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

        // Check if session was created (no email confirmation required)
        if (data.session) {
          // User is logged in immediately - redirect to home
          setSuccess(true)
          setTimeout(() => {
            router.push('/')
            router.refresh()
          }, 1500)
        } else {
          // Email confirmation required - show verification message
          setNeedsVerification(true)
          setSuccess(true)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEmail = () => {
    setNeedsVerification(false)
    setSuccess(false)
    setPassword('') // Clear password for security
    setConfirmPassword('') // Clear confirm password for security
    setError(null)
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

          {success && needsVerification && (
            <div className="bg-blue-500/20 border border-blue-500 text-blue-100 px-4 py-3 rounded-xl space-y-2">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="font-semibold">Verification Email Sent!</p>
                  <p className="text-sm mt-1">
                    We've sent a verification link to
                    <br />
                    <span className="font-medium">{email}</span>{' '}
                    <button 
                      onClick={handleEditEmail}
                      className="text-blue-300 hover:text-blue-200 underline text-xs"
                    >
                      Not you?
                    </button>
                  </p>
                  <p className="text-sm mt-2">
                    Please check your inbox and click the verification link to activate your account. 
                    Once verified, you can <Link href="/login" className="underline hover:text-blue-200">login here</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && !needsVerification && (
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
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || needsVerification}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                  minLength={3}
                />
                <p className="text-xs text-white/50 mt-1 px-4">
                  Alphanumeric (hyphens and underscores allowed in between)
                </p>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || needsVerification}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || needsVerification}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 pr-12 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={loading || needsVerification}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || needsVerification}
                  className="w-full bg-transparent text-white text-lg px-4 py-3 pr-12 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/70 disabled:opacity-50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  disabled={loading || needsVerification}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || needsVerification}
              className="w-full bg-white text-black text-lg font-medium py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {!needsVerification && (
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-white text-base hover:opacity-80 transition-opacity"
              >
                Already Have An Account? Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
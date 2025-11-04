"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, LogOut, CreditCard, Calendar } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Subscription {
  plan_name: string;
  status: string;
  next_renewal_at: string | null;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check for user session and subscription
  useEffect(() => {
    const getUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user's subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan_name, status, next_renewal_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        setSubscription(subData);
      } else {
        setSubscription(null);
      }
    };

    getUserAndSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserAndSubscription();
      } else {
        setSubscription(null);
      }
    });

    return () => {
      authSub.unsubscribe();
    };
  }, [supabase]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLearnMenu = () => {
    setIsLearnOpen(!isLearnOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    setIsUserMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">The Chesseract</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 md:space-x-6 lg:space-x-8">
            <Link href="/play" className="text-white hover:text-blue-400 transition-colors">
              Play
            </Link>
            <div className="relative group">
              <button className="flex items-center text-white hover:text-blue-400 transition-colors">
                Learn <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/coaches" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Find your Coach
                  </Link>
                  <Link href="/analysis" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Analysis Board
                  </Link>
                  <Link href="/editor" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Board Editor
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/shop" className="text-white hover:text-blue-400 transition-colors">
              Shop
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Login/ Signup or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{user.user_metadata?.username || user.email?.split('@')[0]}</span>
                    {subscription && (
                      <span className="text-xs text-purple-400">{subscription.plan_name} Plan</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-200 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.user_metadata?.username || 'User'}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    {subscription ? (
                      <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Current Plan
                          </span>
                          <span className="text-purple-400 font-semibold">{subscription.plan_name}</span>
                        </div>
                        {subscription.next_renewal_at && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Renewal On
                            </span>
                            <span className="text-gray-400 text-sm">
                              {new Date(subscription.next_renewal_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-gray-400 text-sm">No active subscription</p>
                        <Link href="/#plans" className="text-purple-400 text-sm hover:text-purple-300">
                          View Plans →
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-gray-900 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/play"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={closeMenu}
          >
            Play
          </Link>
          <div>
            <button
              className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-gray-800 rounded-md"
              onClick={toggleLearnMenu}
            >
              Learn
              <ChevronDown className={`h-4 w-4 transform transition-transform ${isLearnOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`pl-4 space-y-1 ${isLearnOpen ? 'block' : 'hidden'}`}>
              <Link 
                href="/coaches"
                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                onClick={closeMenu}
              >
                Find your Coach
              </Link>
              <Link 
                href="/analysis"
                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                onClick={closeMenu}
              >
                Analysis Board
              </Link>
              <Link 
                href="/editor"
                className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                onClick={closeMenu}
              >
                Board Editor
              </Link>
            </div>
          </div>
          <Link 
            href="/shop"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={closeMenu}
          >
            Shop
          </Link>
          <Link 
            href="/blog"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={closeMenu}
          >
            Blog
          </Link>
          <Link 
            href="/about"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            href="/contact"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <>
                <div className="px-3 py-2 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.user_metadata?.username || user.email}</span>
                  </div>
                  {subscription && (
                    <div className="bg-gray-800 rounded-lg p-2 mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Plan:</span>
                        <span className="text-purple-400 font-semibold">{subscription.plan_name}</span>
                      </div>
                      {subscription.next_renewal_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Renewal:</span>
                          <span className="text-gray-300">
                            {new Date(subscription.next_renewal_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-white hover:bg-gray-800 rounded-md mt-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="block px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mt-2"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex w-full items-center justify-between border-b bg-white px-4 py-4 sm:px-8">
        <div className="flex items-center space-x-1">
          <span className="text-lg font-semibold text-green-600">Affli.</span>
          <span className="text-lg font-bold text-black">ai</span>
        </div>

        <nav className="flex space-x-6 text-sm font-medium text-black">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/signup" className="hover:underline">
            Sign Up
          </Link>
          <Link href="/plan" className="hover:underline">
            Plan
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </nav>
      </header>

      <section className="flex min-h-[calc(100vh-73px)] flex-grow flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
          TikTok Shop Creator Management
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Automated creator outreach, affiliate tracking, and sales analytics
          for TikTok Shop sellers
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/signup">
            <button className="rounded-md bg-black px-6 py-2 font-semibold text-white shadow transition hover:bg-gray-900">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="rounded-md border border-gray-300 px-6 py-2 font-semibold text-black transition hover:bg-gray-100">
              Login
            </button>
          </Link>
        </div>
      </section>

      <div className="w-full bg-gray-50 px-6 py-12 sm:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-black">
              Creator Outreach
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Automate your TikTok creator outreach with personalized messages
              and follow-ups
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">
              Affiliate Tracking
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Track creator performance and commissions with real-time analytics
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">
              Sales Analytics
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Comprehensive sales data and insights to optimize your TikTok Shop
              performance
            </p>
          </div>
        </div>
      </div>

      <footer className="flex w-full flex-col justify-between border-t bg-white px-4 py-6 text-sm text-gray-500 sm:px-8 md:flex-row">
        <p>© 2025 Affli.ai. All rights reserved.</p>
        <div className="mt-2 flex space-x-6 md:mt-0">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}

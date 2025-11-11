import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to Mantis
        </h1>
        <p className="text-center text-lg mb-8">
          A Next.js application with Supabase Authentication
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🔐 Authentication
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Secure authentication powered by Supabase with email/password login.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🛡️ Protected Routes
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Middleware-based route protection for secure pages.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              ⚡ Next.js 15
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Built with the latest Next.js features and App Router.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🎨 Tailwind CSS
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Beautiful, responsive UI with Tailwind CSS and dark mode support.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

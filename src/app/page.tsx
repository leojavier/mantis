import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardBody, Chip } from '@heroui/react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <Chip 
              color="primary" 
              variant="flat"
              className="mb-6"
            >
              Powered by Next.js 15 & Supabase
            </Chip>
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to Mantis
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A modern Next.js application with beautiful UI, powerful authentication, 
              and advanced screenshot capabilities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
                  >
                    Go to Dashboard →
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="bordered"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need for a modern web application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                🔐 Authentication
              </h3>
              <p className="text-sm text-gray-400">
                Secure authentication powered by Supabase with email/password login
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                🛡️ Protected Routes
              </h3>
              <p className="text-sm text-gray-400">
                Middleware-based route protection for secure pages
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                📸 Screenshot Tool
              </h3>
              <p className="text-sm text-gray-400">
                Capture full-page website screenshots with Puppeteer
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                🎨 Beautiful UI
              </h3>
              <p className="text-sm text-gray-400">
                Built with HeroUI for a modern, accessible design
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Built With Modern Technologies
          </h2>
          <p className="text-gray-400 text-lg">
            Leveraging the best tools for performance and developer experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Next.js 15', color: 'from-blue-400 to-cyan-400' },
            { name: 'TypeScript', color: 'from-blue-500 to-blue-600' },
            { name: 'Supabase', color: 'from-green-400 to-emerald-500' },
            { name: 'HeroUI', color: 'from-purple-400 to-pink-400' },
            { name: 'Tailwind CSS', color: 'from-cyan-400 to-blue-500' },
            { name: 'Puppeteer', color: 'from-orange-400 to-red-500' },
          ].map((tech) => (
            <Card key={tech.name} className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-4 text-center">
                <p className={`text-sm font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.name}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
          <CardBody className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Create an account now and experience the power of modern web development
            </p>
            {!user && (
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
                >
                  Sign Up Now →
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © 2025 Mantis. Built with ❤️ using Next.js and HeroUI.
          </p>
        </div>
      </footer>
    </main>
  )
}

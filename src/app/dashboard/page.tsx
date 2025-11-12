import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mantis Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Chip
                variant="flat"
                color="primary"
                size="sm"
              >
                {user.email}
              </Chip>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-400 text-lg">
            You&apos;re successfully authenticated with Supabase
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/screenshot">
              <Card 
                isPressable
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl font-bold text-white">Screenshot Tool</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Capture full-page website screenshots
                      </p>
                    </div>
                    <div className="ml-auto">
                      <svg
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link href="/dashboard/history">
              <Card 
                isPressable
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <CardBody className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl font-bold text-white">Screenshot History</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        View and manage saved screenshots
                      </p>
                    </div>
                    <div className="ml-auto">
                      <svg
                        className="h-6 w-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>

        {/* User Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <dt className="text-sm font-medium text-gray-400">
                      User ID
                    </dt>
                    <dd className="text-xs text-white mt-1 truncate">
                      {user.id}
                    </dd>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <dt className="text-sm font-medium text-gray-400">
                      Email
                    </dt>
                    <dd className="text-sm text-white mt-1 truncate">
                      {user.email}
                    </dd>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <dt className="text-sm font-medium text-gray-400">
                      Status
                    </dt>
                    <dd className="text-sm text-white mt-1">
                      <Chip color="success" size="sm" variant="flat">
                        Authenticated
                      </Chip>
                    </dd>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* User Information Card */}
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
          <CardHeader className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Complete User Information
            </h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-gray-300">
                {JSON.stringify(user, null, 2)}
              </code>
            </pre>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}

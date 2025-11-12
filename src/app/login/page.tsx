'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Divider } from '@heroui/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
          <CardHeader className="flex flex-col gap-2 px-8 pt-8 pb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to your account to continue
            </p>
          </CardHeader>
          
          <CardBody className="px-8 py-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardBody>

          <Divider className="bg-gray-700" />

          <CardFooter className="px-8 py-6">
            <p className="text-sm text-gray-400 text-center w-full">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Divider } from '@heroui/react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Sign up to get started with Mantis
            </p>
          </CardHeader>
          
          <CardBody className="px-8 py-6">
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

              {success && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/50 p-3">
                  <p className="text-sm text-green-400">
                    Account created successfully! Check your email to confirm. Redirecting...
                  </p>
                </div>
              )}

              <Button
                type="submit"
                color="secondary"
                size="lg"
                isLoading={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </CardBody>

          <Divider className="bg-gray-700" />

          <CardFooter className="px-8 py-6">
            <p className="text-sm text-gray-400 text-center w-full">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

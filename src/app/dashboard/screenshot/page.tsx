'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ScreenshotPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setScreenshot(null)
    setScreenshotUrl(null)
    setLoading(true)
    setCountdown(30) // Estimated time in seconds
    setProgress(0)

    // Start countdown timer
    const startTime = Date.now()
    const estimatedDuration = 30000 // 30 seconds

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, estimatedDuration - elapsed)
      const remainingSeconds = Math.ceil(remaining / 1000)
      const progressPercentage = Math.min(100, (elapsed / estimatedDuration) * 100)
      
      setCountdown(remainingSeconds)
      setProgress(progressPercentage)

      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, 100)

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to take screenshot')
      }

      setScreenshot(data.image)
      setScreenshotUrl(data.url)
      setProgress(100)
    } catch (err: any) {
      console.error('Screenshot error:', err)
      setError(err.message || 'An error occurred while taking the screenshot')
    } finally {
      setLoading(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setCountdown(0)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (!screenshot) return

    const link = document.createElement('a')
    link.href = screenshot
    link.download = `screenshot-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Website Screenshot Tool
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Capture Website Screenshots
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter any URL to take a full-page screenshot
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Website URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {countdown > 0 ? `${countdown}s remaining...` : 'Taking Screenshot...'}
                    </span>
                  ) : (
                    'Take Screenshot'
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Include http:// or https:// in the URL. Note: Screenshots typically take 10-30 seconds.
              </p>
            </div>
          </form>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processing... {Math.round(progress)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ~{countdown}s remaining
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>✓ Loading page content...</p>
                <p>✓ Triggering lazy-loaded images...</p>
                <p>✓ Waiting for all resources...</p>
                <p className={progress > 80 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>
                  {progress > 80 ? '✓ Capturing screenshot...' : '○ Capturing screenshot...'}
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Screenshot Display */}
        {screenshot && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Screenshot Result
                </h3>
                {screenshotUrl && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {screenshotUrl}
                  </p>
                )}
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            </div>

            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <img
                src={screenshot}
                alt="Website Screenshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!screenshot && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-blue-600"
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
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Full Page Capture
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Captures the entire webpage including lazy-loaded content
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  High Quality
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Screenshots are taken at 1920x1080 resolution
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Download
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Save screenshots as PNG files to your device
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


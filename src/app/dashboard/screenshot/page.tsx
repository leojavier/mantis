'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardBody, Input, Button, Progress, Chip } from '@heroui/react'

export default function ScreenshotPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [pageContent, setPageContent] = useState<any>(null)
  const [countdown, setCountdown] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
    setPageContent(null)
    setLoading(true)
    setCountdown(30)
    setProgress(0)

    const startTime = Date.now()
    const estimatedDuration = 30000

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
      setPageContent(data.content)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Screenshot Tool
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            Capture Website Screenshots 📸
          </h2>
          <p className="text-gray-400 text-lg">
            Enter any URL to take a full-page screenshot
          </p>
        </div>

        {/* URL Input Card */}
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  isRequired
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-white text-lg",
                    inputWrapper: "border-gray-700 hover:border-gray-600 h-14",
                  }}
                />
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 font-semibold px-8"
                >
                  {loading ? `${countdown}s remaining...` : 'Capture'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Include http:// or https:// • Popups & cookie banners automatically removed • 10-30 seconds
              </p>
            </form>

            {/* Progress Bar */}
            {loading && (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">
                    Processing... {Math.round(progress)}%
                  </span>
                  <Chip color="primary" variant="flat" size="sm">
                    ~{countdown}s remaining
                  </Chip>
                </div>
                <Progress
                  value={progress}
                  color="primary"
                  className="w-full"
                  classNames={{
                    indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                  }}
                />
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Loading page content...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Removing popups & cookie banners...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Triggering lazy-loaded images...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Waiting for all resources...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${progress > 80 ? 'text-blue-400 font-medium' : ''}`}>
                    {progress > 80 ? (
                      <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                    )}
                    <span>Capturing screenshot...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Error</h3>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Screenshot Display */}
        {screenshot && (
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardHeader className="px-6 pt-6">
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Screenshot Result ✓
                  </h3>
                  {screenshotUrl && (
                    <p className="text-sm text-gray-400 mt-1">
                      {screenshotUrl}
                    </p>
                  )}
                </div>
                <Button
                  color="success"
                  variant="flat"
                  onPress={handleDownload}
                  startContent={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshot}
                  alt="Website Screenshot"
                  className="w-full h-auto"
                />
              </div>
            </CardBody>
          </Card>
        )}

        {/* Extracted Content */}
        {pageContent && (
          <div className="mt-8 space-y-6">
            {/* Content Stats */}
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardHeader className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  📊 Content Statistics
                </h3>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Words</p>
                    <p className="text-2xl font-bold text-white">{pageContent.wordCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Characters</p>
                    <p className="text-2xl font-bold text-white">{pageContent.charCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Headings</p>
                    <p className="text-2xl font-bold text-white">{pageContent.headings.length}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Links</p>
                    <p className="text-2xl font-bold text-white">{pageContent.links.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Page Info */}
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardHeader className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  📄 Page Information
                </h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Title</p>
                  <p className="text-white font-medium">{pageContent.title || 'No title'}</p>
                </div>
                {pageContent.metaDescription && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-gray-300">{pageContent.metaDescription}</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Headings */}
            {pageContent.headings.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
                <CardHeader className="px-6 pt-6">
                  <h3 className="text-lg font-semibold text-white">
                    🔤 Headings Structure
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pageContent.headings.map((heading: any, index: number) => (
                      <div key={index} className={`flex items-start gap-2 ${
                        heading.level === 'h1' ? 'pl-0' :
                        heading.level === 'h2' ? 'pl-4' :
                        heading.level === 'h3' ? 'pl-8' :
                        heading.level === 'h4' ? 'pl-12' :
                        heading.level === 'h5' ? 'pl-16' : 'pl-20'
                      }`}>
                        <Chip 
                          size="sm" 
                          variant="flat"
                          color={
                            heading.level === 'h1' ? 'primary' :
                            heading.level === 'h2' ? 'secondary' :
                            'default'
                          }
                        >
                          {heading.level.toUpperCase()}
                        </Chip>
                        <p className="text-gray-300 flex-1">{heading.text}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Text Content */}
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardHeader className="px-6 pt-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  📝 Extracted Text Content
                </h3>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    navigator.clipboard.writeText(pageContent.bodyText)
                  }}
                >
                  Copy Text
                </Button>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                    {pageContent.bodyText}
                  </pre>
                </div>
              </CardBody>
            </Card>

            {/* Links */}
            {pageContent.links.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
                <CardHeader className="px-6 pt-6">
                  <h3 className="text-lg font-semibold text-white">
                    🔗 Links Found ({pageContent.links.length})
                  </h3>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pageContent.links.map((link: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-colors">
                        <svg className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 font-medium">{link.text}</p>
                          <a 
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 break-all"
                          >
                            {link.href}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* Info Cards */}
        {!screenshot && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Full Page Capture
              </h3>
              <p className="text-sm text-gray-400">
                Captures the entire webpage with popups & cookie banners automatically removed
              </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  High Quality
                </h3>
                <p className="text-sm text-gray-400">
                  Screenshots are taken at 1920x1080 resolution
                </p>
              </CardBody>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Download
                </h3>
                <p className="text-sm text-gray-400">
                  Save screenshots as PNG files to your device
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

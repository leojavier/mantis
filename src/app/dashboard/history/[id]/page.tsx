'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardBody, CardHeader, Button, Chip, Spinner } from '@heroui/react'
import Link from 'next/link'

interface Screenshot {
  id: string
  url: string
  screenshot_data: string
  page_title: string | null
  meta_description: string | null
  body_text: string | null
  headings: any[]
  links: any[]
  word_count: number
  char_count: number
  created_at: string
}

export default function ScreenshotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadScreenshot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadScreenshot = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('screenshots')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError) throw fetchError

      setScreenshot(data)
    } catch (err: any) {
      console.error('Error loading screenshot:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !screenshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/20 border border-red-700">
            <CardBody className="p-12 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Screenshot Not Found
              </h3>
              <p className="text-gray-400 mb-6">
                {error || 'The screenshot you&apos;re looking for doesn&apos;t exist.'}
              </p>
              <Button
                as={Link}
                href="/dashboard/history"
                color="primary"
              >
                Back to History
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {screenshot.page_title || 'Screenshot Details'}
            </h1>
            <p className="text-gray-400">
              Captured on {formatDate(screenshot.created_at)}
            </p>
          </div>
          <Button
            as={Link}
            href="/dashboard/history"
            color="default"
            variant="flat"
          >
            ← Back to History
          </Button>
        </div>

        {/* URL and Metadata */}
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
          <CardBody className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">URL</p>
              <a
                href={screenshot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 break-all"
              >
                {screenshot.url}
              </a>
            </div>
            {screenshot.meta_description && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-gray-300">{screenshot.meta_description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Screenshot */}
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
          <CardHeader className="px-6 pt-6">
            <h2 className="text-2xl font-semibold text-white">📸 Screenshot</h2>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="bg-white rounded-lg p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot.screenshot_data}
                alt={screenshot.page_title || screenshot.url}
                className="w-full h-auto"
              />
            </div>
          </CardBody>
        </Card>

        {/* Content Statistics */}
        <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
          <CardHeader className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">
              📊 Content Statistics
            </h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Words</p>
                <p className="text-2xl font-bold text-white">{screenshot.word_count.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Characters</p>
                <p className="text-2xl font-bold text-white">{screenshot.char_count.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Headings</p>
                <p className="text-2xl font-bold text-white">{screenshot.headings?.length || 0}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Links</p>
                <p className="text-2xl font-bold text-white">{screenshot.links?.length || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Headings */}
        {screenshot.headings && screenshot.headings.length > 0 && (
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
            <CardHeader className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-white">
                🔤 Headings Structure
              </h3>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {screenshot.headings.map((heading: any, index: number) => (
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
        {screenshot.body_text && (
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
            <CardHeader className="px-6 pt-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                📝 Extracted Text Content
              </h3>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => {
                  navigator.clipboard.writeText(screenshot.body_text || '')
                }}
              >
                Copy Text
              </Button>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                  {screenshot.body_text}
                </pre>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Links */}
        {screenshot.links && screenshot.links.length > 0 && (
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardHeader className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-white">
                🔗 Links Found ({screenshot.links.length})
              </h3>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {screenshot.links.map((link: any, index: number) => (
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
    </div>
  )
}


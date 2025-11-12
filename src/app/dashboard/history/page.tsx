'use client'

import { useEffect, useState } from 'react'
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

export default function HistoryPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadScreenshots()
  }, [])

  const loadScreenshots = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('screenshots')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setScreenshots(data || [])
    } catch (err: any) {
      console.error('Error loading screenshots:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteScreenshot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) return

    try {
      setDeletingId(id)
      const supabase = createClient()
      
      const { error: deleteError } = await supabase
        .from('screenshots')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setScreenshots(screenshots.filter(s => s.id !== id))
    } catch (err: any) {
      console.error('Error deleting screenshot:', err)
      alert('Failed to delete screenshot: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📸 Screenshot History
            </h1>
            <p className="text-gray-400">
              View and manage your saved screenshots
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              as={Link}
              href="/dashboard/screenshot"
              color="primary"
              variant="flat"
            >
              ➕ New Screenshot
            </Button>
            <Button
              as={Link}
              href="/dashboard"
              color="default"
              variant="flat"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Screenshots</p>
                  <p className="text-2xl font-bold text-white">{screenshots.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Words Captured</p>
                  <p className="text-2xl font-bold text-white">
                    {screenshots.reduce((sum, s) => sum + (s.word_count || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Links Found</p>
                  <p className="text-2xl font-bold text-white">
                    {screenshots.reduce((sum, s) => sum + (s.links?.length || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border border-red-700 mb-6">
            <CardBody className="p-6">
              <p className="text-red-400">❌ Error: {error}</p>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={loadScreenshots}
                className="mt-3"
              >
                Retry
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Empty State */}
        {screenshots.length === 0 && !error && (
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-12 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Screenshots Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start by capturing your first website screenshot
              </p>
              <Button
                as={Link}
                href="/dashboard/screenshot"
                color="primary"
                size="lg"
              >
                Take Your First Screenshot
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Screenshots Grid */}
        {screenshots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((screenshot) => (
              <Card
                key={screenshot.id}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700 hover:border-gray-600 transition-all"
              >
                <CardHeader className="p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshot.screenshot_data}
                    alt={screenshot.page_title || screenshot.url}
                    className="w-full h-48 object-cover object-top"
                  />
                </CardHeader>
                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">
                      {screenshot.page_title || 'Untitled'}
                    </h3>
                    <Chip size="sm" variant="flat" color="primary">
                      {formatDate(screenshot.created_at)}
                    </Chip>
                  </div>

                  <a
                    href={screenshot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 line-clamp-1 mb-3 block"
                  >
                    {screenshot.url}
                  </a>

                  {screenshot.meta_description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {screenshot.meta_description}
                    </p>
                  )}

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Chip size="sm" variant="flat" color="default">
                      {screenshot.word_count.toLocaleString()} words
                    </Chip>
                    <Chip size="sm" variant="flat" color="default">
                      {screenshot.links?.length || 0} links
                    </Chip>
                    <Chip size="sm" variant="flat" color="default">
                      {screenshot.headings?.length || 0} headings
                    </Chip>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      href={`/dashboard/history/${screenshot.id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      isLoading={deletingId === screenshot.id}
                      onPress={() => deleteScreenshot(screenshot.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


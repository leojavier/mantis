'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardBody, CardHeader, Button, Spinner, Chip } from '@heroui/react'
import Link from 'next/link'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface Screenshot {
  id: string
  url: string
  screenshot_data: string
  page_title: string | null
  created_at: string
}

interface ScreenshotsByDate {
  [date: string]: Screenshot[]
}

export default function GalleryPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [screenshotsByDate, setScreenshotsByDate] = useState<ScreenshotsByDate>({})
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedScreenshots, setSelectedScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadScreenshots()
  }, [])

  useEffect(() => {
    // Update selected screenshots when date changes
    const dateKey = selectedDate.toISOString().split('T')[0]
    setSelectedScreenshots(screenshotsByDate[dateKey] || [])
  }, [selectedDate, screenshotsByDate])

  const loadScreenshots = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('screenshots')
        .select('id, url, screenshot_data, page_title, created_at')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setScreenshots(data || [])

      // Group screenshots by date
      const grouped: ScreenshotsByDate = {}
      data?.forEach((screenshot) => {
        const date = new Date(screenshot.created_at).toISOString().split('T')[0]
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(screenshot)
      })
      setScreenshotsByDate(grouped)

      // Set today's screenshots as default
      const today = new Date().toISOString().split('T')[0]
      setSelectedScreenshots(grouped[today] || [])
    } catch (err: any) {
      console.error('Error loading screenshots:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().split('T')[0]
      if (screenshotsByDate[dateKey]) {
        return 'has-screenshots'
      }
    }
    return null
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().split('T')[0]
      const count = screenshotsByDate[dateKey]?.length || 0
      if (count > 0) {
        return (
          <div className="screenshot-count">
            {count}
          </div>
        )
      }
    }
    return null
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
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
              📅 Screenshot Gallery
            </h1>
            <p className="text-gray-400">
              Calendar view of your captured screenshots
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
                  <span className="text-2xl">📸</span>
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
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Days with Screenshots</p>
                  <p className="text-2xl font-bold text-white">
                    {Object.keys(screenshotsByDate).length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selected Date</p>
                  <p className="text-2xl font-bold text-white">{selectedScreenshots.length}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardHeader className="px-6 pt-6">
                <h2 className="text-2xl font-semibold text-white">
                  📆 Calendar
                </h2>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="calendar-container">
                  <Calendar
                    onChange={(value) => setSelectedDate(value as Date)}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    className="custom-calendar"
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Selected Date Info */}
          <div>
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 mb-6">
              <CardHeader className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  Selected Date
                </h3>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <p className="text-gray-300 mb-4">
                  {formatDate(selectedDate)}
                </p>
                <Chip
                  color={selectedScreenshots.length > 0 ? 'success' : 'default'}
                  variant="flat"
                  size="lg"
                >
                  {selectedScreenshots.length} Screenshot{selectedScreenshots.length !== 1 ? 's' : ''}
                </Chip>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardHeader className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  Quick Actions
                </h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 space-y-3">
                <Button
                  color="primary"
                  variant="flat"
                  className="w-full"
                  onPress={() => setSelectedDate(new Date())}
                >
                  📍 Go to Today
                </Button>
                <Button
                  as={Link}
                  href="/dashboard/screenshot"
                  color="secondary"
                  variant="flat"
                  className="w-full"
                >
                  ➕ Take Screenshot
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Screenshots for Selected Date */}
        {selectedScreenshots.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Screenshots from {formatDate(selectedDate)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedScreenshots.map((screenshot) => (
                <Card
                  key={screenshot.id}
                  className="bg-gray-800/50 backdrop-blur-md border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <CardHeader className="p-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot.screenshot_data}
                      alt={screenshot.page_title || screenshot.url}
                      className="w-full h-48 object-cover object-top cursor-pointer"
                      onClick={() => window.open(`/dashboard/history/${screenshot.id}`, '_blank')}
                    />
                  </CardHeader>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {screenshot.page_title || 'Untitled'}
                      </h3>
                      <Chip size="sm" variant="flat" color="primary">
                        {formatTime(screenshot.created_at)}
                      </Chip>
                    </div>

                    <a
                      href={screenshot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 line-clamp-1 mb-4 block"
                    >
                      {screenshot.url}
                    </a>

                    <Button
                      as={Link}
                      href={`/dashboard/history/${screenshot.id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Selected Date */}
        {selectedScreenshots.length === 0 && !loading && (
          <div className="mt-8">
            <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700">
              <CardBody className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Screenshots on This Date
                </h3>
                <p className="text-gray-400 mb-6">
                  {formatDate(selectedDate)} has no captured screenshots yet.
                </p>
                <Button
                  as={Link}
                  href="/dashboard/screenshot"
                  color="primary"
                  size="lg"
                >
                  Take a Screenshot
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <style jsx global>{`
        .calendar-container {
          display: flex;
          justify-content: center;
        }

        .custom-calendar {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
          font-family: inherit;
        }

        .custom-calendar .react-calendar__navigation {
          display: flex;
          margin-bottom: 1em;
        }

        .custom-calendar .react-calendar__navigation button {
          color: white;
          min-width: 44px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: rgba(156, 163, 175, 1);
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.75rem;
          text-align: center;
        }

        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 1rem 0.5rem;
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid rgba(75, 85, 99, 0.5);
          color: white;
          border-radius: 0.5rem;
          margin: 0.15rem;
          position: relative;
          min-height: 60px;
        }

        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .custom-calendar .react-calendar__tile--now {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }

        .custom-calendar .react-calendar__tile--active {
          background: rgba(59, 130, 246, 0.3) !important;
          border-color: rgba(59, 130, 246, 0.7) !important;
          font-weight: bold;
        }

        .custom-calendar .react-calendar__tile.has-screenshots {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          font-weight: 600;
        }

        .custom-calendar .react-calendar__tile.has-screenshots:enabled:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.7);
        }

        .screenshot-count {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(139, 92, 246, 0.8);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .custom-calendar .react-calendar__tile--now.has-screenshots {
          background: rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  )
}


import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  let browser = null
  
  try {
    // Check if user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL format
    let targetUrl: URL
    try {
      targetUrl = new URL(url)
      // Ensure it's http or https
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please include http:// or https://' },
        { status: 400 }
      )
    }

    console.log('Starting screenshot for:', targetUrl.toString())

    // Launch browser and take screenshot
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()
    
    // Set viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    console.log('Navigating to page...')
    
    // Navigate to the page with a more forgiving wait strategy
    try {
      await page.goto(targetUrl.toString(), {
        waitUntil: 'networkidle2', // More forgiving: waits for <2 connections for 500ms
        timeout: 45000,
      })
    } catch (navError: any) {
      console.warn('Navigation with networkidle2 failed, trying with load only:', navError.message)
      // Fallback: just wait for basic load event
      await page.goto(targetUrl.toString(), {
        waitUntil: 'load',
        timeout: 30000,
      })
    }

    console.log('Page loaded, waiting for content to settle...')

    // Give the page a moment to render
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('Scrolling to trigger lazy content...')

    // Scroll to bottom to trigger lazy loading
    try {
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          window.scrollTo(0, document.body.scrollHeight)
          setTimeout(resolve, 2000)
        })
      })
    } catch (scrollError) {
      console.warn('Scroll evaluation failed, continuing anyway:', scrollError)
    }

    // Scroll back to top
    try {
      await page.evaluate(() => {
        window.scrollTo(0, 0)
      })
    } catch (scrollError) {
      console.warn('Scroll to top failed, continuing anyway:', scrollError)
    }

    console.log('Waiting for images to load...')

    // Wait for images with timeout protection
    try {
      await Promise.race([
        page.evaluate(() => {
          return Promise.all(
            Array.from(document.images)
              .filter((img) => !img.complete)
              .map(
                (img) =>
                  new Promise((resolve) => {
                    img.addEventListener('load', resolve)
                    img.addEventListener('error', resolve)
                    setTimeout(resolve, 3000)
                  })
              )
          )
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)), // Max 5 seconds for all images
      ])
    } catch (imageError) {
      console.warn('Image loading wait failed, continuing anyway:', imageError)
    }

    // Final wait to ensure everything settles
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Taking screenshot...')

    // Take full page screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png',
    })

    await browser.close()
    browser = null

    console.log('Screenshot completed successfully')

    // Convert buffer to base64
    const base64Image = screenshot.toString('base64')

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      url: targetUrl.toString(),
    })
  } catch (error: any) {
    console.error('Screenshot error:', error)
    console.error('Error stack:', error.stack)
    
    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
    
    return NextResponse.json(
      {
        error: 'Failed to take screenshot',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}


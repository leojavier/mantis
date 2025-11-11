# 📸 Screenshot Tool Documentation

## Overview

The Screenshot Tool is a powerful feature that allows authenticated users to capture full-page screenshots of any website. It uses Puppeteer on the server-side to render and capture complete web pages.

## Access

The Screenshot Tool is available at:
- **URL**: `/dashboard/screenshot`
- **Access**: Protected (requires authentication)

You can access it from the Dashboard via the "Screenshot Tool" quick action card.

## Features

### ✨ Key Capabilities

1. **Full-Page Capture**
   - Captures the entire webpage, not just the viewport
   - Automatically scrolls and stitches the complete page

2. **High Quality**
   - Screenshots taken at 1920x1080 resolution
   - PNG format for lossless quality
   - Perfect for documentation, archiving, or presentations

3. **URL Validation**
   - Validates URL format before processing
   - Ensures http:// or https:// protocol
   - Provides helpful error messages

4. **Download Capability**
   - Download screenshots directly to your device
   - Files named with timestamp: `screenshot-{timestamp}.png`

5. **Real-Time Processing**
   - Loading indicator during screenshot capture
   - Immediate display of results
   - Error handling with user-friendly messages

## How to Use

### Step 1: Navigate to the Tool
1. Log in to your account
2. Go to Dashboard
3. Click on "Screenshot Tool" quick action

Or directly visit: [http://localhost:3000/dashboard/screenshot](http://localhost:3000/dashboard/screenshot)

### Step 2: Enter URL
1. Type or paste a complete URL in the input field
2. Make sure to include `http://` or `https://`
3. Examples:
   - ✅ `https://www.example.com`
   - ✅ `https://github.com/vercel/next.js`
   - ❌ `example.com` (missing protocol)
   - ❌ `www.example.com` (missing protocol)

### Step 3: Capture Screenshot
1. Click the "Take Screenshot" button
2. Wait for the process to complete (usually 5-30 seconds)
3. The screenshot will appear below the form

### Step 4: Download (Optional)
1. Click the "Download" button above the screenshot
2. The image will be saved to your downloads folder
3. Filename format: `screenshot-{timestamp}.png`

## Technical Details

### API Endpoint

- **Endpoint**: `/api/screenshot`
- **Method**: POST
- **Authentication**: Required (checks Supabase session)
- **Request Body**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "image": "data:image/png;base64,...",
    "url": "https://example.com"
  }
  ```

### Technology Stack

- **Puppeteer**: Headless Chrome for rendering pages
- **Next.js API Routes**: Server-side screenshot generation
- **Supabase Auth**: Session validation and access control

### Browser Configuration

- Viewport: 1920x1080
- Device Scale Factor: 1
- Full Page: Yes
- Format: PNG
- Wait Strategy: 
  - networkidle0 (waits for ALL network connections to finish)
  - Scrolls to bottom to trigger lazy-loaded content
  - Waits for all images to load completely
  - Multiple checkpoints for dynamic content
- Timeout: 60 seconds

## Error Handling

The tool handles various error scenarios:

### Common Errors

1. **"URL is required"**
   - Solution: Make sure to enter a URL

2. **"Invalid URL format"**
   - Solution: Include `http://` or `https://` in the URL

3. **"Unauthorized"**
   - Solution: Make sure you're logged in

4. **"Failed to take screenshot"**
   - Possible causes:
     - Website is down or unreachable
     - Website blocks automated access
     - Timeout (page took too long to load)
   - Solutions:
     - Verify the URL works in a regular browser
     - Try again later
     - Try a different website

## Performance Considerations

### Processing Time

Screenshot generation typically takes:
- Simple pages: 5-10 seconds
- Medium complexity: 15-25 seconds
- Complex pages: 25-40 seconds
- Lazy-loaded content: +5-10 seconds

Factors affecting speed:
- Page size and complexity
- Number of external resources
- Server response time
- Network latency

### Resource Usage

Puppeteer launches a headless Chrome instance for each screenshot:
- Memory: ~50-200MB per request
- CPU: Moderate during rendering
- Network: Downloads all page resources

For production deployment, consider:
- Rate limiting
- Request queuing
- Caching frequent screenshots
- Using a dedicated service (e.g., Screenshot API services)

## Use Cases

### 1. Website Monitoring
- Capture periodic snapshots of your sites
- Track visual changes over time
- Document website updates

### 2. Client Presentations
- Show full page designs
- Capture competitor websites
- Create visual references

### 3. Documentation
- Create screenshots for tutorials
- Document user interfaces
- Archive web content

### 4. Quality Assurance
- Visual regression testing
- Cross-reference with design mockups
- Bug reporting with full context

### 5. Content Archiving
- Save web pages before they change
- Archive important content
- Create backups of online resources

## Security Features

1. **Authentication Required**
   - Only logged-in users can access the tool
   - Session validation on every request

2. **URL Validation**
   - Ensures valid http/https protocols
   - Prevents local file access
   - Validates URL format

3. **Sandboxed Browser**
   - Puppeteer runs with security flags
   - No sandbox access to local filesystem
   - Isolated from main server process

## Limitations

1. **Protected Content**
   - Cannot capture pages requiring login
   - Cannot bypass paywalls or authentication

2. **JavaScript Required**
   - Some dynamic content may not render fully
   - SPAs with heavy client-side rendering may need adjustments

3. **Timeout**
   - Maximum 30-second processing time
   - Very large pages may timeout

4. **File Size**
   - Long pages create large PNG files
   - May impact browser performance when displaying

## Future Enhancements

Potential improvements:
- [ ] Screenshot history and gallery
- [ ] Multiple viewport sizes (mobile, tablet, desktop)
- [ ] Scheduled screenshots
- [ ] PDF export option
- [ ] Custom viewport dimensions
- [ ] Element-specific screenshots
- [ ] Comparison tool (before/after)
- [ ] Annotation tools
- [ ] Share screenshot links

## Troubleshooting

### Screenshots are blank
- The website may be blocking automated access
- Try a different website to verify functionality

### Server timeout
- The page is taking too long to load
- Try a simpler/faster loading page
- Check your internet connection

### Download not working
- Check browser popup blocker settings
- Ensure download permissions are enabled
- Try right-click → Save Image As

### API returns 401 Unauthorized
- Your session may have expired
- Log out and log back in
- Clear browser cookies and retry

## Support

For issues or questions:
1. Check the error message displayed
2. Review this documentation
3. Check browser console for errors
4. Verify you're logged in
5. Try a different URL to isolate the issue

## Example URLs to Try

Start with these reliable websites:
- `https://example.com` (simple, fast)
- `https://github.com` (modern design)
- `https://news.ycombinator.com` (lightweight)
- `https://www.wikipedia.org` (content-heavy)

---

**Note**: This tool is designed for personal and professional use. Please respect website terms of service and robots.txt files when capturing screenshots.


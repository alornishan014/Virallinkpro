import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Handle Xhamster
    if (url.includes('xhamster.com') || url.includes('xhamster.one') || url.includes('xhamster2.com')) {
      try {
        // Extract video ID from Xhamster URL
        const videoIdMatch = url.match(/videos\/([^\/\?]+)/)
        if (videoIdMatch) {
          const videoId = videoIdMatch[1]
          // Return embed URL
          const embedUrl = `https://xhamster.com/xembed.php?video=${videoId}`
          return NextResponse.json({ 
            embedUrl,
            directUrl: url,
            platform: 'xhamster'
          })
        }
      } catch (error) {
        console.error('Xhamster extraction error:', error)
      }
    }

    // Handle XNXX
    if (url.includes('xnxx.com') || url.includes('xnxx2.com') || url.includes('xnxx3.com')) {
      try {
        // Extract video ID from XNXX URL
        const videoIdMatch = url.match(/video-([a-zA-Z0-9_-]+)/)
        if (videoIdMatch) {
          const videoId = videoIdMatch[1]
          // Try to get embed URL
          const embedUrl = `https://www.xnxx.com/embed-iframe/${videoId}.html`
          return NextResponse.json({ 
            embedUrl,
            directUrl: url,
            platform: 'xnxx'
          })
        }
      } catch (error) {
        console.error('XNXX extraction error:', error)
      }
    }

    // Handle 9anime
    if (url.includes('9anime') || url.includes('animedekho')) {
      try {
        // For anime sites, we'll use a different approach
        // Return a streaming-compatible URL
        return NextResponse.json({ 
          embedUrl: url,
          directUrl: url,
          platform: 'anime',
          method: 'direct'
        })
      } catch (error) {
        console.error('Anime site extraction error:', error)
      }
    }

    // For other blocked sites, try to get direct video URL
    try {
      // Use a public proxy service to extract video
      const proxyUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`
      
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Try to extract video URLs from the page
        const videoUrlMatches = html.match(/https?:\/\/[^\s"']*\.mp4[^\s"']*/gi)
        const m3u8Matches = html.match(/https?:\/\/[^\s"']*\.m3u8[^\s"']*/gi)
        
        if (videoUrlMatches && videoUrlMatches.length > 0) {
          return NextResponse.json({ 
            embedUrl: videoUrlMatches[0],
            directUrl: videoUrlMatches[0],
            platform: 'extracted',
            method: 'direct'
          })
        }
        
        if (m3u8Matches && m3u8Matches.length > 0) {
          return NextResponse.json({ 
            embedUrl: m3u8Matches[0],
            directUrl: m3u8Matches[0],
            platform: 'extracted',
            method: 'hls'
          })
        }
      }
    } catch (error) {
      console.error('Proxy extraction error:', error)
    }

    // Fallback: return original URL with iframe
    return NextResponse.json({ 
      embedUrl: url,
      directUrl: url,
      platform: 'fallback',
      method: 'iframe'
    })

  } catch (error) {
    console.error('Video extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract video URL' },
      { status: 500 }
    )
  }
}
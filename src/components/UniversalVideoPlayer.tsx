'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, ExternalLink, AlertCircle } from 'lucide-react'

interface UniversalVideoPlayerProps {
  url: string
  title: string
  className?: string
}

export default function UniversalVideoPlayer({ url, title, className = '' }: UniversalVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const resolveEmbedUrl = async () => {
      const resolvedUrl = await getEmbedUrl(url)
      setEmbedUrl(resolvedUrl)
    }
    resolveEmbedUrl()
  }, [url])

  const isDirectVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|m4v|3gp)$/i)
  }

  const isEmbeddable = (url: string) => {
    const embeddablePlatforms = [
      'youtube.com',
      'youtu.be',
      'drive.google.com',
      'onedrive.live.com',
      '1drv.ms',
      'vimeo.com',
      'dailymotion.com',
      'tiktok.com',
      'instagram.com',
      'facebook.com',
      'fb.watch',
      'twitter.com',
      'x.com',
      'xhamster.com',
      'xhamster.one',
      'xhamster2.com',
      '9anime',
      'animedekho'
    ]
    
    return embeddablePlatforms.some(platform => url.includes(platform))
  }

  const getEmbedUrl = async (originalUrl: string) => {
    // YouTube
    if (originalUrl.includes('youtube.com/watch?v=')) {
      const videoId = originalUrl.split('v=')[1]?.split('&')[0]
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    }
    if (originalUrl.includes('youtu.be/')) {
      const videoId = originalUrl.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    }
    
    // Google Drive
    if (originalUrl.includes('drive.google.com')) {
      const fileId = originalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
      const altFileId = originalUrl.match(/id=([a-zA-Z0-9_-]+)/)?.[1]
      if (altFileId) {
        return `https://drive.google.com/file/d/${altFileId}/preview`
      }
    }
    
    // OneDrive
    if (originalUrl.includes('1drv.ms')) {
      return originalUrl.replace('1drv.ms', 'onedrive.live.com/embed')
    }
    if (originalUrl.includes('onedrive.live.com')) {
      if (originalUrl.includes('/download')) {
        return originalUrl.replace('/download', '/embed')
      }
      if (!originalUrl.includes('/embed')) {
        return originalUrl + '/embed'
      }
    }
    
    // Vimeo
    if (originalUrl.includes('vimeo.com')) {
      const videoId = originalUrl.match(/vimeo\.com\/(\d+)/)?.[1]
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&byline=0&portrait=0`
      }
    }
    
    // Dailymotion
    if (originalUrl.includes('dailymotion.com')) {
      const videoId = originalUrl.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/)?.[1]
      if (videoId) {
        return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&ui-highlight=0`
      }
    }
    
    // TikTok
    if (originalUrl.includes('tiktok.com')) {
      const videoId = originalUrl.split('/video/')[1]?.split('?')[0]
      if (videoId) {
        return `https://www.tiktok.com/embed/v2/${videoId}`
      }
    }
    
    // Instagram
    if (originalUrl.includes('instagram.com')) {
      const postId = originalUrl.split('/p/')[1]?.split('/')[0]
      if (postId) {
        return `https://ddinstagram.com/p/${postId}/embed`
      }
    }
    
    // Facebook
    if (originalUrl.includes('facebook.com') || originalUrl.includes('fb.watch')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=false&autoplay=1&width=560`
    }
    
    // Twitter/X
    if (originalUrl.includes('twitter.com') || originalUrl.includes('x.com')) {
      return `https://twitframe.com/show?url=${encodeURIComponent(originalUrl)}&theme=dark`
    }
    
    // Xhamster - Use custom proxy
    if (originalUrl.includes('xhamster.com') || originalUrl.includes('xhamster.one') || originalUrl.includes('xhamster2.com')) {
      try {
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: originalUrl })
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.embedUrl || originalUrl
        }
      } catch (error) {
        console.error('Proxy error for Xhamster:', error)
      }
      // Fallback: try direct embed
      const videoIdMatch = originalUrl.match(/videos\/([^\/]+)/)
      if (videoIdMatch) {
        const videoId = videoIdMatch[1]
        return `https://xhamster.com/xembed.php?video=${videoId}`
      }
    }
    
    // 9anime and similar anime sites
    if (originalUrl.includes('9anime') || originalUrl.includes('animedekho')) {
      try {
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: originalUrl })
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.embedUrl || originalUrl
        }
      } catch (error) {
        console.error('Proxy error for anime site:', error)
      }
    }
    
    // For unsupported platforms, use a proxy service
    return `https://r.jina.ai/http://${originalUrl.replace(/^https?:\/\//, '')}`
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load video. Trying alternative method...')
    setTimeout(() => {
      setUseFallback(true)
    }, 2000)
  }

  const canEmbed = isEmbeddable(url) && !useFallback && embedUrl
  const isVideoFile = isDirectVideo(url)

  if (isVideoFile) {
    return (
      <video
        src={url}
        controls
        autoPlay
        className={`w-full h-full ${className}`}
        title={title}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load video file')
          setIsLoading(false)
        }}
      />
    )
  }

  if (canEmbed) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="text-white text-center p-6">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <p className="mb-4">{error}</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => setUseFallback(true)}
                  className="w-full mb-2"
                >
                  Try Alternative Method
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="w-full"
                >
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open on Original Site
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className={`w-full h-full border-0 ${className}`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    )
  }

  // Fallback for unsupported platforms
  return (
    <div className={`w-full h-full flex items-center justify-center bg-black ${className}`}>
      <div className="text-center text-white p-8">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold mb-3">External Video Platform</h3>
        <p className="text-gray-300 mb-6 max-w-md">
          This video is hosted on an external platform. Click below to watch it directly.
        </p>
        <div className="space-y-3">
          <Button 
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Watch Video Now
            </a>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setUseFallback(false)}
            className="w-full"
          >
            Try Embed Again
          </Button>
        </div>
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Original URL:</p>
          <p className="text-xs font-mono break-all text-gray-300">{url}</p>
        </div>
      </div>
    </div>
  )
}
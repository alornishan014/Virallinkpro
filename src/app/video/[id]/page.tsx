'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Download, Eye, Clock, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import UniversalVideoPlayer from '@/components/UniversalVideoPlayer'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl?: string
  description?: string
  category: string
  views: number
  createdAt: string
}

export default function VideoPlayer() {
  const params = useParams()
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])

  useEffect(() => {
    if (params.id) {
      fetchVideo(params.id as string)
      fetchRelatedVideos()
    }
  }, [params.id])

  const fetchVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/videos/${id}`)
      if (response.ok) {
        const data = await response.json()
        setVideo(data)
      }
    } catch (error) {
      console.error('Failed to fetch video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setRelatedVideos(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to fetch related videos:', error)
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded" />
              <span className="text-xl font-bold">VideoHub</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <UniversalVideoPlayer 
                url={video.videoUrl}
                title={video.title}
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatViews(video.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(video.createdAt)}
                </span>
                <Badge variant="secondary">{video.category}</Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Description */}
              {video.description && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Related Videos */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
            <div className="space-y-4 max-h-screen overflow-y-auto">
              {relatedVideos
                .filter(v => v.id !== video.id)
                .map((relatedVideo) => (
                  <Link href={`/video/${relatedVideo.id}`} key={relatedVideo.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="flex gap-3 p-3">
                        <div className="relative w-40 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                          {relatedVideo.thumbnailUrl ? (
                            <img
                              src={relatedVideo.thumbnailUrl}
                              alt={relatedVideo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 bg-muted-foreground/20 rounded" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedVideo.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatViews(relatedVideo.views)}
                            </span>
                            <span>•</span>
                            <span>{formatDate(relatedVideo.createdAt)}</span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {relatedVideo.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
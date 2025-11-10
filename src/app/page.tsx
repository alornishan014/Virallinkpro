'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, Play, Eye, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'general', 'music', 'gaming', 'education', 'entertainment', 'sports', 'anime', 'adult']

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <Play className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">VideoHub</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="border-b">
        <div className="container px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* New Videos Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">New Videos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredVideos.slice(0, 8).map((video) => (
                <Link href={`/video/${video.id}`} key={video.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative aspect-video bg-muted">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(video.views)}
                        </span>
                        <span>•</span>
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Most Viewed Section */}
        {filteredVideos.length > 8 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Most Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos
                .sort((a, b) => b.views - a.views)
                .slice(0, 8)
                .map((video) => (
                  <Link href={`/video/${video.id}`} key={video.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative aspect-video bg-muted">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatViews(video.views)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {video.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Less Viewed Section */}
        {filteredVideos.length > 16 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Discover More</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos
                .sort((a, b) => a.views - b.views)
                .slice(0, 8)
                .map((video) => (
                  <Link href={`/video/${video.id}`} key={video.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative aspect-video bg-muted">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatViews(video.views)}
                          </span>
                          <span>•</span>
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {video.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">VideoHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your universal video platform. Watch videos from any source in one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">General</Link></li>
                <li><Link href="#" className="hover:text-foreground">Music</Link></li>
                <li><Link href="#" className="hover:text-foreground">Gaming</Link></li>
                <li><Link href="#" className="hover:text-foreground">Education</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Admin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/admin" className="hover:text-foreground">Admin Dashboard</Link></li>
                <li><Link href="#" className="hover:text-foreground">Upload Video</Link></li>
                <li><Link href="#" className="hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 VideoHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
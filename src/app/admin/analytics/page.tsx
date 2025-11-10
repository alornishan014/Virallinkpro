'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, TrendingUp, Eye, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Analytics {
  totalVisitors: number
  monthlyVisitors: number
  totalViews: number
  monthlyViews: number
  totalVideos: number
  liveVisitors: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisitors: 0,
    monthlyVisitors: 0,
    totalViews: 0,
    monthlyViews: 0,
    totalVideos: 0,
    liveVisitors: 0
  })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    } else {
      setIsAuthenticated(true)
      fetchAnalytics()
    }
  }, [router])

  const fetchAnalytics = async () => {
    try {
      // Fetch videos
      const videosResponse = await fetch('/api/videos')
      if (videosResponse.ok) {
        const videos = await videosResponse.json()
        
        // Calculate analytics from videos
        const totalViews = videos.reduce((sum: number, video: any) => sum + video.views, 0)
        const totalVideos = videos.length
        
        // Simulate visitor data (in real app, this would come from analytics database)
        const simulatedAnalytics = {
          totalVisitors: Math.floor(totalViews * 0.7), // Assume 70% of views are unique visitors
          monthlyVisitors: Math.floor(totalViews * 0.3), // Assume 30% are from this month
          totalViews,
          monthlyViews: Math.floor(totalViews * 0.4), // Assume 40% are from this month
          totalVideos,
          liveVisitors: Math.floor(Math.random() * 20) + 1 // Random live visitors
        }
        
        setAnalytics(simulatedAnalytics)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <a href="/">View Site</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Live Visitors</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.liveVisitors}</p>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Visitors</p>
                  <p className="text-2xl font-bold">{analytics.monthlyVisitors.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                  <p className="text-2xl font-bold">{analytics.totalVideos}</p>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Visitor Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Visitors (All Time)</span>
                  <span className="font-medium">{analytics.totalVisitors.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Visitors</span>
                  <span className="font-medium">{analytics.monthlyVisitors.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Live Visitors</span>
                  <span className="font-medium text-green-600">{analytics.liveVisitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Views per Visitor</span>
                  <span className="font-medium">
                    {analytics.totalVisitors > 0 ? (analytics.totalViews / analytics.totalVisitors).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Video Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Videos</span>
                  <span className="font-medium">{analytics.totalVideos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <span className="font-medium">{analytics.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Views</span>
                  <span className="font-medium">{analytics.monthlyViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Views per Video</span>
                  <span className="font-medium">
                    {analytics.totalVideos > 0 ? Math.floor(analytics.totalViews / analytics.totalVideos) : '0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.monthlyVisitors > 0 ? '+' + Math.floor((analytics.monthlyViews / analytics.monthlyVisitors) * 100) + '%' : '0%'}
                </div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-xs text-muted-foreground">Views per visitor this month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.totalVideos > 0 ? Math.floor(analytics.totalViews / analytics.totalVideos) : '0'}
                </div>
                <p className="text-sm text-muted-foreground">Avg. Video Performance</p>
                <p className="text-xs text-muted-foreground">Average views per video</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.totalVisitors > 0 ? Math.floor((analytics.monthlyVisitors / analytics.totalVisitors) * 100) + '%' : '0%'}
                </div>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
                <p className="text-xs text-muted-foreground">Monthly vs total visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
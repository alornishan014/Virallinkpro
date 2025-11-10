import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const sampleVideos = [
  {
    title: "Amazing Nature Documentary - 4K Ultra HD",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/nature1/640/360.jpg",
    description: "Experience the breathtaking beauty of nature in stunning 4K resolution. This documentary takes you on a journey through the world's most spectacular landscapes.",
    category: "general",
    views: 1250
  },
  {
    title: "Google Drive Video Sample",
    videoUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
    thumbnailUrl: "https://picsum.photos/seed/drive1/640/360.jpg",
    description: "Sample video hosted on Google Drive platform for testing purposes.",
    category: "general",
    views: 850
  },
  {
    title: "OneDrive Video Sample",
    videoUrl: "https://1drv.ms/v/s!AtqB8X2mKq9ZgZ8y7L9tR3fXw2Y7Q?e=Q9W8X7",
    thumbnailUrl: "https://picsum.photos/seed/onedrive1/640/360.jpg",
    description: "Sample video hosted on Microsoft OneDrive for testing purposes.",
    category: "general",
    views: 620
  },
  {
    title: "Direct MP4 Video Sample",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://picsum.photos/seed/mp41/640/360.jpg",
    description: "Direct MP4 video file for testing native video player functionality.",
    category: "technology",
    views: 2100
  },
  {
    title: "Epic Gaming Moments 2024",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/gaming1/640/360.jpg",
    description: "The most epic gaming moments of 2024. Watch incredible plays, funny fails, and amazing achievements from top gamers worldwide.",
    category: "gaming",
    views: 3400
  },
  {
    title: "Learn Programming in 30 Minutes",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/edu1/640/360.jpg",
    description: "A comprehensive introduction to programming for beginners. Learn the basics of coding in just 30 minutes with this easy-to-follow tutorial.",
    category: "education",
    views: 890
  },
  {
    title: "Relaxing Music for Study and Focus",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/music1/640/360.jpg",
    description: "Beautiful instrumental music to help you study, focus, and concentrate. Perfect for background music while working or reading.",
    category: "music",
    views: 2100
  },
  {
    title: "Hilarious Comedy Stand-up Special",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/comedy1/640/360.jpg",
    description: "Laugh out loud with this hilarious stand-up comedy special. The best jokes and observational humor from top comedians.",
    category: "entertainment",
    views: 4500
  },
  {
    title: "Championship Sports Highlights 2024",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/sports1/640/360.jpg",
    description: "The most thrilling moments from championship sports events. Watch incredible comebacks, record-breaking performances, and amazing plays.",
    category: "sports",
    views: 3200
  },
  {
    title: "Travel Vlog: Hidden Paradise Islands",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/travel1/640/360.jpg",
    description: "Discover the world's most beautiful hidden paradise islands. Join us on an amazing journey to tropical destinations you've never seen before.",
    category: "travel",
    views: 1800
  },
  {
    title: "Latest Technology Breakthroughs 2024",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://picsum.photos/seed/tech1/640/360.jpg",
    description: "Explore the latest technology breakthroughs that are changing our world. From AI innovations to space exploration, see what's next in tech.",
    category: "technology",
    views: 2700
  }
]

export async function POST() {
  try {
    // Clear existing videos
    await db.video.deleteMany({})
    
    // Add sample videos
    for (const video of sampleVideos) {
      await db.video.create({
        data: video
      })
    }

    return NextResponse.json({ 
      message: 'Sample videos seeded successfully',
      count: sampleVideos.length 
    })
  } catch (error) {
    console.error('Error seeding videos:', error)
    return NextResponse.json(
      { error: 'Failed to seed videos' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const count = await db.video.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error checking videos:', error)
    return NextResponse.json(
      { error: 'Failed to check videos' },
      { status: 500 }
    )
  }
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, ArrowRight, Link } from "lucide-react"




const featuredEvents = [
  {
    id: 1,
    title: "Spring Cultural Festival 2025",
    description: "Join us for the biggest cultural event of the year. Music, dance, art, and more!",
    date: "April 28-30, 2025",
    location: "College Amphitheater",
    image: "/api/placeholder/800/400",
  },
  {
    id: 2,
    title: "Tech Hackathon 2025",
    description: "48 hours of coding, innovation, and prizes. Build solutions for real-world problems.",
    date: "May 15-17, 2025",
    location: "Engineering Building",
    image: "/api/placeholder/800/400",
  },
  {
    id: 3,
    title: "Research Symposium",
    description: "Present your research and connect with faculty and industry experts in your field.",
    date: "June 5, 2025",
    location: "Science Complex",
    image: "/api/placeholder/800/400",
  },
]


export default function HeroSection() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const currentEvent = featuredEvents[currentEventIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Theme colors
  const colors = {
    primary: "#2c7873", // Teal for primary actions
    primaryLight: "#d5efe6", // Light mint green for backgrounds
    secondary: "#fde8e6", // Soft pink for secondary elements
    textPrimary: "#000000", // Black for primary text
  }

  return (
    <div className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            <span className="text-black">Campus</span>
            <span style={{ color: colors.primary }}> Events</span>
          </h1>
          <p className="text-gray-600 mt-1">Discover and participate in exciting events around campus</p>
        </div>

        {/* Featured Event Slideshow */}
        <div 
          className="mb-12 overflow-hidden rounded-xl shadow-sm"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4 p-8">
              <div
                className="inline-block w-fit rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: colors.secondary, color: colors.primary }}
              >
                Featured Event
              </div>
              <h2 className="text-2xl font-bold md:text-3xl text-black">{currentEvent.title}</h2>
              <p className="text-gray-600 max-w-md">{currentEvent.description}</p>
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 bg-white">
                    <CalendarDays className="h-4 w-4" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-gray-700">{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 bg-white">
                    <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-gray-700">{currentEvent.location}</span>
                </div>
              </div>
              <div className="pt-4">
                <Button className="rounded-md px-6 py-2 text-white" style={{ backgroundColor: colors.primary }} >
                  Register Now
                </Button>
              </div>
            </div>
            
            {/* Fixed size image container */}
            <div className="hidden md:block relative h-64">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(to left, transparent, ${colors.primaryLight}60)` }}
                />
              </div>
            </div>
          </div>
          
          {/* Event navigation dots */}
          <div className="flex justify-center space-x-3 py-4 bg-white border-t border-gray-100">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEventIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentEventIndex ? `scale-110` : "bg-gray-300 hover:bg-gray-400"
                }`}
                style={{ backgroundColor: index === currentEventIndex ? colors.primary : undefined }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* View All Events Button */}
        <div className="flex justify-center mt-6">
        <Button
      variant="outline"
      className="rounded-md px-6 border-gray-200 hover:bg-gray-50 transition-colors"
      style={{ color: colors.primary }}
      onClick={() => navigate("/events")}
    >
      <span className="flex items-center">
        View All Events
        <ArrowRight className="ml-2 h-4 w-4" />
      </span>
    </Button>
        </div>
      </div>
    </div>
  )
}
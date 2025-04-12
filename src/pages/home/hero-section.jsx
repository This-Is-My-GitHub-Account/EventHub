"use client"

import { useState, useEffect } from "react"
import { CalendarDays, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { eventsApi } from "../../lib/api" // Import events API

export default function HeroSection() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [featuredEvents, setFeaturedEvents] = useState([]) // fetched events array
  const navigate = useNavigate()

  // Fetch events via eventsApi.getAll and store at most 5 events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.getAll()
        const events = response.data || []
        setFeaturedEvents(events.slice(0, 5))
        setCurrentEventIndex(0)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }
    fetchEvents()
  }, [])

  // Cycle through featured events if available
  useEffect(() => {
    if (featuredEvents.length === 0) return
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredEvents])

  const currentEvent = featuredEvents[currentEventIndex] || {}

  // Theme colors
  const colors = {
    primary: "#2c7873",
    primaryLight: "#d5efe6",
    secondary: "#fde8e6",
    textPrimary: "#000000",
  }

  return (
    <div className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            <span className="text-black">Campus</span>
            <span style={{ color: colors.primary }}> Events</span>
          </h1>
          <p className="text-gray-600 mt-1">Discover and participate in exciting events around campus</p>
        </div>

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

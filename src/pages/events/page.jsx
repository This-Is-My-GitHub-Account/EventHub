"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import EventCard from "../../components/ui-components/event-card"
import EventFilters from "./filters"
import { eventsApi } from "../../api" // Import the events API

// Updated color theme constants 
const colors = {
  primary: "#2c7873",
  secondary: "#d5efe6",
  text: "#000000",
  background: "#ffffff"
}

export default function EventsPage() {
  const [searchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [departments, setDepartments] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  
  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await eventsApi.getAll()
        const eventsData = response.data
        
        // Extract unique departments and event types
        const uniqueDepartments = [...new Set(eventsData.map(event => event.department))]
          .filter(Boolean)
          .map(dept => ({
            name: dept,
            id: dept.toLowerCase().replace(/\s+/g, '-')
          }))
        
        const uniqueEventTypes = [...new Set(eventsData.map(event => event.event_type))]
          .filter(Boolean)
        
        setDepartments(uniqueDepartments)
        setEventTypes(uniqueEventTypes)
        
        // Transform the event data to match your frontend structure
        const transformedEvents = eventsData.map(event => ({
          id: event.id,
          title: event.event_name,
          description: event.event_description,
          date: event.registration_deadline,
          department: event.department,
          departmentId: event.department?.toLowerCase().replace(/\s+/g, '-'),
          location: event.venue || "Online",
          type: event.event_type,
          status: new Date(event.registration_deadline) > new Date() ? "upcoming" : "past",
          registrations: 0, // You'd need an additional API call to get registration count
          image: event.image_url || "/images/default-event.jpg"
        }))
        
        setEvents(transformedEvents)
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  useEffect(() => {
    const initialFilters = {
      search: searchParams.get("search") || "",
      department: searchParams.get("department") || "all",
      status: searchParams.get("status") || "all",
      type: searchParams.get("type") || "all",
      sortBy: searchParams.get("sortBy") || "date",
    }
    applyFilters(initialFilters)
  }, [events, searchParams])

  const applyFilters = (filters) => {
    let filtered = [...events]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          (event.department && event.department.toLowerCase().includes(searchLower)) ||
          (event.location && event.location.toLowerCase().includes(searchLower))
      )
    }

    // Department filter
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter((event) => event.departmentId === filters.department)
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((event) => event.status === filters.status)
    }

    // Event type filter
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((event) => 
        event.type && event.type.toLowerCase() === filters.type.toLowerCase()
      )
    }

    // Sorting
    switch (filters.sortBy) {
      case "date":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "registrations":
        filtered.sort((a, b) => b.registrations - a.registrations)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredEvents(filtered)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2c7873]">Events</h1>
            <p className="text-gray-700 mt-2">Discover and register for upcoming events</p>
          </div>

          <EventFilters 
            onFilterChange={applyFilters} 
            departments={departments}
            eventTypes={eventTypes}
          />

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c7873]"></div>
            </div>
          ) : error ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center border rounded-md p-8 text-center bg-white shadow-sm border-red-200">
              <h3 className="text-xl font-semibold mb-2 text-red-600">{error}</h3>
              <button 
                className="px-4 py-2 bg-[#2c7873] text-white rounded-md hover:bg-opacity-90 transition-colors mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center border rounded-md p-8 text-center bg-white shadow-sm border-[#d5efe6]">
              <h3 className="text-xl font-semibold mb-2 text-[#2c7873]">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
              <button 
                className="px-4 py-2 bg-[#2c7873] text-white rounded-md hover:bg-opacity-90 transition-colors"
                onClick={() => applyFilters({
                  search: "",
                  department: "all",
                  status: "all",
                  type: "all",
                  sortBy: "date",
                })}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
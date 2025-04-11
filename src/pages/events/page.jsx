"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import EventCard from "../../components/ui-components/event-card"
import EventFilters from "./filters"
import { departments } from "../../dummy" // Import the departments data

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
  
  // Function to flatten all department events into a single array
  const getAllEvents = () => {
    const allEvents = []
    departments.forEach(department => {
      department.events.forEach(event => {
        allEvents.push({
          ...event,
          department: department.name,
          departmentId: department.name.toLowerCase().replace(/\s+/g, '-')
        })
      })
    })
    return allEvents
  }

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const allEvents = getAllEvents()
      setEvents(allEvents)
      setLoading(false)
    }, 500)
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
          event.department.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
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
        event.type.toLowerCase() === filters.type.toLowerCase()
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

  // Function to get unique event types from all departments
  const getEventTypes = () => {
    const typesSet = new Set()
    departments.forEach(department => {
      department.events.forEach(event => {
        typesSet.add(event.type)
      })
    })
    return Array.from(typesSet)
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
            eventTypes={getEventTypes()}
          />

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c7873]"></div>
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
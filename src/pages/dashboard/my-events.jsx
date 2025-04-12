"use client"

import { useState, useEffect } from "react"
import { Calendar, ClockIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import { eventsApi, registrationApi } from "../../lib/api" // Import the API functions

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("registered")
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [createdEvents, setCreatedEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch both registered and created events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch registered events
        const registrationsResponse = await registrationApi.getUserRegistrations()
        setRegisteredEvents(registrationsResponse.data || [])
        
        // Fetch events created by the user
        const createdEventsResponse = await eventsApi.getUserEvents()
        setCreatedEvents(createdEventsResponse.data || [])
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load your events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (event) => {
    const today = new Date()
    const eventDate = new Date(event.event_date || event.date)
    
    // Check if the event is in the past
    if (eventDate < today) {
      return <Badge className="bg-gray-500">Completed</Badge>
    }
    
    // If the event is today
    if (eventDate.toDateString() === today.toDateString()) {
      return <Badge className="bg-green-500">Ongoing</Badge>
    }
    
    // If the event is in the future
    return <Badge className="bg-blue-500">Upcoming</Badge>
  }

  // Function to handle the event click and navigate
  const handleViewEvent = (event) => {
    navigate(`/event-details/${event.id}`)
  }

  // Function to handle deletion of a created event
  const handleDeleteEvent = async (id) => {
    try {
      await eventsApi.delete(id)
      // Filter out deleted event from state
      setCreatedEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const renderRegisteredEvents = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading your registered events...</div>
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>
    }

    if (registeredEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registered events found</h3>
          <p className="text-gray-500 mb-6">You haven't registered for any events yet.</p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {registeredEvents.map((registration) => {
          const event = registration.event || registration
          return (
            <div key={registration.id} className="border rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Link 
                        to={`/event-details/${event.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {event.event_name || event.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500">{event.department}</p>
                  </div>
                  {getStatusBadge(event)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{formatDate(event.event_date || event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{event.time || "All day"}</span>
                  </div>
                </div>

                {registration.team_name && (
                  <div className="mt-4">
                    <p className="font-medium">Team: {registration.team_name}</p>
                    {registration.team_members && (
                      <div className="mt-2 space-y-1">
                        {registration.team_members.map((member, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-gray-500 ml-2">{member.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-5 py-3 flex justify-end border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewEvent(event)}
                >
                  View Event
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderCreatedEvents = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading your created events...</div>
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>
    }

    if (createdEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No created events found</h3>
          <p className="text-gray-500 mb-6">You haven't created any events yet.</p>
          <Link to="/create-event">
            <Button>Create Event</Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {createdEvents.map((event) => (
          <div key={event.id} className="border rounded-lg overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    <Link 
                      to={`/event-details/${event.id}`} 
                      className="hover:text-primary transition-colors"
                    >
                      {event.event_name || event.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500">{event.department}</p>
                </div>
                {getStatusBadge(event)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{formatDate(event.event_date || event.date)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{event.time || "All day"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewEvent(event)}
              >
                View Event
              </Button>
              <Button size="sm" asChild>
                <Link to={`/edit-event/${event.id}`}>Edit Event</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteEvent(event.id)}
              >
                Delete Event
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Events</h2>
          <Link to="/create-event">
            <Button>Create New Event</Button>
          </Link>
        </div>

        <Tabs defaultValue="registered" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="registered">Registered Events</TabsTrigger>
            <TabsTrigger value="created">Created Events</TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className={activeTab === "registered" ? "block" : "hidden"}>
            {renderRegisteredEvents()}
          </TabsContent>

          <TabsContent value="created" className={activeTab === "created" ? "block" : "hidden"}>
            {renderCreatedEvents()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Calendar, ClockIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("registered")
  const navigate = useNavigate()

  // Mock registered events - in a real app, fetch this from API
  const registeredEvents = [
    {
      id: 1,
      title: "Hackathon 2023",
      date: "2023-07-15",
      time: "09:00 AM - 06:00 PM",
      location: "Main Auditorium",
      department: "Computer Engineering",
      status: "upcoming",
      teamName: "CodeCrafters",
      teamMembers: [
        { name: "John Doe", email: "john.doe@example.com" },
        { name: "Jane Smith", email: "jane.smith@example.com" },
        { name: "Alice Johnson", email: "alice.j@example.com" },
      ],
    },
    {
      id: 2,
      title: "Web Development Workshop",
      date: "2023-06-10",
      time: "10:00 AM - 03:00 PM",
      location: "Computer Lab",
      department: "Information Technology",
      status: "completed",
      teamName: null,
      teamMembers: null,
    },
  ]

  // Mock created events - in a real app, fetch this from API
  const createdEvents = [
    {
      id: 3,
      title: "UI/UX Design Challenge",
      date: "2023-08-05",
      time: "02:00 PM - 05:00 PM",
      location: "Seminar Hall",
      department: "Computer Engineering",
      status: "upcoming",
      registrations: 35,
      maxRegistrations: 50,
    },
  ]

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      default:
        return null
    }
  }

  // Function to handle the event click and pass data
  const handleViewEvent = (event) => {
    navigate(`/event-details/${event.id}`, { state: { eventData: event } })
  }

  const renderRegisteredEvents = () => {
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
        {registeredEvents.map((event) => (
          <div key={event.id} className="border rounded-lg overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    <Link 
                      to={`/event-details/${event.id}`} 
                      state={{ eventData: event }}
                      className="hover:text-primary transition-colors"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500">{event.department}</p>
                </div>
                {getStatusBadge(event.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              </div>

              {event.teamName && (
                <div className="mt-4">
                  <p className="font-medium">Team: {event.teamName}</p>
                  <div className="mt-2 space-y-1">
                    {event.teamMembers.map((member, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-gray-500 ml-2">{member.email}</span>
                      </div>
                    ))}
                  </div>
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
        ))}
      </div>
    )
  }

  const renderCreatedEvents = () => {
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
                      state={{ eventData: event }}
                      className="hover:text-primary transition-colors"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500">{event.department}</p>
                </div>
                {getStatusBadge(event.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Registrations</span>
                  <span>
                    {event.registrations}/{event.maxRegistrations}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(event.registrations / event.maxRegistrations) * 100}%` }}
                  />
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
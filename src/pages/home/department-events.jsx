"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Loader2
} from "lucide-react"

// Import API functions
import { eventsApi } from "../../lib/api"

// Import department icons and colors (keeping these from dummy.jsx)
import { departments as deptConfigs, colors } from "../../dummy"

export default function DepartmentEvents() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  // Function to determine event status based on dates
  const determineEventStatus = (event) => {
    const today = new Date();
    const startDate = new Date(event.important_dates.start_date);
    const endDate = new Date(event.important_dates.end_date);
    
    if (today < startDate) {
      return "upcoming";
    } else if (today >= startDate && today <= endDate) {
      return "ongoing";
    } else {
      return "completed";
    }
  }
  
  // Function to organize events by department and status
  const organizeEvents = (eventsData) => {
    const organized = {}
    
    // Initialize structure with department names from config
    deptConfigs.forEach(dept => {
      organized[dept.name] = {
        icon: dept.icon,
        events: {
          upcoming: [],
          ongoing: [],
          completed: []
        }
      }
    })
    
    // Organize events by department and status
    eventsData.forEach(event => {
      // Determine the status if it's not already set
      const status = event.status || determineEventStatus(event);
      
      // Get formatted event for display
      const formattedEvent = {
        id: event.id,
        title: event.event_name,
        type: event.category,
        date: new Date(event.important_dates.start_date).toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        }),
        time: "All Day", // You might want to adjust this if you have specific time data
        location: event.venue,
        registrations: event.max_participants || 0,
        image: event.image_url,
        status: status
      };
      
      // Find the appropriate department
      const departmentName = event.department.charAt(0).toUpperCase() + event.department.slice(1);
      
      // Make sure the department exists in our structure
      if (organized[departmentName]) {
        // Add event to appropriate status array
        organized[departmentName].events[status].push(formattedEvent);
      } else if (organized["All"]) {
        // If department doesn't match any in our config but we have an "All" category
        organized["All"].events[status].push(formattedEvent);
      }
    })
    
    return organized
  }

  useEffect(() => {
    // Fetch events when component mounts
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await eventsApi.getAll()
        setEvents(organizeEvents(response.data))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  // Helper function to handle card click
  const slugify = (name) => name.toLowerCase().replace(/\s+/g, "-");
  const handleViewAll = (departmentName,eventstatus) =>() => {
    const departmentSlug = slugify(departmentName)
    navigate(`/events?department=${departmentSlug}&status=${eventstatus}&sortBy=date`)

  }

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white py-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" style={{ color: colors.primary }} />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
            style={{ backgroundColor: colors.primary }}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-black">Department Events</h2>
        
        {/* Event Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6 border-b border-gray-200 w-full justify-start bg-transparent">
            <TabsTrigger
              value="upcoming"
              className="relative px-4 py-2 data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:translate-y-px data-[state=active]:shadow-none rounded-none bg-transparent"
              style={{ "--tw-text-opacity": 1, color: activeTab === "upcoming" ? colors.primary : "#6b7280" }}
            >
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              className="relative px-4 py-2 data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:translate-y-px data-[state=active]:shadow-none rounded-none bg-transparent"
              style={{ "--tw-text-opacity": 1, color: activeTab === "ongoing" ? colors.primary : "#6b7280" }}
            >
              Ongoing Events
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="relative px-4 py-2 data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:translate-y-px data-[state=active]:shadow-none rounded-none bg-transparent"
              style={{ "--tw-text-opacity": 1, color: activeTab === "completed" ? colors.primary : "#6b7280" }}
            >
              Completed Events
            </TabsTrigger>
          </TabsList>
          
          {/* Upcoming Events Content */}
          <TabsContent value="upcoming" className="space-y-12">
            {Object.entries(events).map(([departmentName, departmentData]) => {
              const filteredEvents = departmentData.events.upcoming;
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${departmentName}-upcoming`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <departmentData.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{departmentName} Department Events</h3>
                    </div>
                    
                      <Button
                        variant="link"
                        className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                        style={{ color: colors.primary }}
                        onClick={handleViewAll(departmentName,"upcoming")}
                      >
                        View all <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredEvents.slice(0, 4).map((event) => (
                      <Card key={event.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: colors.secondary,
                                borderColor: colors.secondary,
                                color: colors.primary,
                              }}
                            >
                              {event.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-100"
                            >
                              <Users className="h-3 w-3" />
                              {event.registrations}
                            </Badge>
                          </div>
                          <CardTitle className="line-clamp-1 text-lg text-black mt-2">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link to={`/event-details/${event.id}`} className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-gray-200 hover:bg-gray-50 transition-colors"
                              style={{ color: colors.primary }}
                              
                            >
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {!Object.values(events).some(dept => dept.events.upcoming.length > 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming events found.</p>
              </div>
            )}
          </TabsContent>

          {/* Ongoing Events Content */}
          <TabsContent value="ongoing" className="space-y-12">
            {Object.entries(events).map(([departmentName, departmentData]) => {
              const filteredEvents = departmentData.events.ongoing;
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${departmentName}-ongoing`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <departmentData.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{departmentName} Department Events</h3>
                    </div>
                    
                      <Button
                        variant="link"
                        className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                        style={{ color: colors.primary }}
                        onClick={handleViewAll(departmentName,"ongoing")}
                      >
                        View all <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                          <div
                            className="absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-md"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Live Now
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: colors.secondary,
                                borderColor: colors.secondary,
                                color: colors.primary,
                              }}
                            >
                              {event.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-100"
                            >
                              <Users className="h-3 w-3" />
                              {event.registrations}
                            </Badge>
                          </div>
                          <CardTitle className="line-clamp-1 text-lg text-black mt-2">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link to={`/events/${event.id}`} className="w-full">
                            <Button
                              className="w-full text-white"
                              style={{ backgroundColor: colors.primary }}
                              onClick={() => handleViewDetails(event.id)}
                            >
                              Join Now
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {!Object.values(events).some(dept => dept.events.ongoing.length > 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No ongoing events at the moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Events Content */}
          <TabsContent value="completed" className="space-y-12">
            {Object.entries(events).map(([departmentName, departmentData]) => {
              const filteredEvents = departmentData.events.completed;
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${departmentName}-completed`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <departmentData.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{departmentName} Department Events</h3>
                    </div>
                    
                      <Button
                        variant="link"
                        className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                        style={{ color: colors.primary }}
                        onClick={handleViewAll(departmentName,"completed")}
                      >
                        View all <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors opacity-75">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover grayscale"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: "#f3f4f6",
                                borderColor: "#e5e7eb",
                                color: "#6b7280",
                              }}
                            >
                              {event.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-100"
                            >
                              <Users className="h-3 w-3" />
                              {event.registrations}
                            </Badge>
                          </div>
                          <CardTitle className="line-clamp-1 text-lg text-black mt-2">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link to={`/events/${event.id}`} className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-gray-200 hover:bg-gray-50 transition-colors"
                              style={{ color: "#6b7280" }}
                              onClick={() => handleViewDetails(event.id)}
                            >
                              View Summary
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {!Object.values(events).some(dept => dept.events.completed.length > 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed events found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
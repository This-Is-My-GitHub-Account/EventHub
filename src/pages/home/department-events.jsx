"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react"

// Import the data from dummy.jsx
import { departments , colors} from "../../dummy"


export default function DepartmentEvents() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Function to filter events based on selected status
  const filterEventsByStatus = (events, status) => {
    return events.filter(event => event.status === status);
  };

  // Function to get events based on department and status
  const getFilteredDepartmentEvents = (department, status) => {
    return filterEventsByStatus(department.events, status);
  };

  // Function to handle card click
  const handleViewDetails = (eventId) => {
    // This would navigate to event detail page
    console.log(`Navigating to event details: ${eventId}`);
    // Navigation is handled by Link component
  };

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
            {departments.map((department) => {
              const filteredEvents = getFilteredDepartmentEvents(department, "upcoming");
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${department.name}-upcoming`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <department.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{department.name} Department Events</h3>
                    </div>
                    <Button
                      variant="link"
                      className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                      style={{ color: colors.primary }}
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
                          <Link to={`/events/${event.id}`} className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-gray-200 hover:bg-gray-50 transition-colors"
                              style={{ color: colors.primary }}
                              onClick={() => handleViewDetails(event.id)}
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
          </TabsContent>

          {/* Ongoing Events Content */}
          <TabsContent value="ongoing" className="space-y-12">
            {departments.map((department) => {
              const filteredEvents = getFilteredDepartmentEvents(department, "ongoing");
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${department.name}-ongoing`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <department.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{department.name} Department Events</h3>
                    </div>
                    <Button
                      variant="link"
                      className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                      style={{ color: colors.primary }}
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
          </TabsContent>

          {/* Completed Events Content */}
          <TabsContent value="completed" className="space-y-12">
            {departments.map((department) => {
              const filteredEvents = getFilteredDepartmentEvents(department, "completed");
              if (filteredEvents.length === 0) return null;
              
              return (
                <div key={`${department.name}-completed`} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div 
                        className="mr-3 p-2 rounded-lg" 
                        style={{ backgroundColor: colors.primaryLight }}
                      >
                        <department.icon className="h-5 w-5" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold text-black">{department.name} Department Events</h3>
                    </div>
                    <Button
                      variant="link"
                      className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                      style={{ color: colors.primary }}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
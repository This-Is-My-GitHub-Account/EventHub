"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  CalendarClock,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Share2,
  Heart,
  Award,
  Calendar,
  DollarSign,
} from "lucide-react"
import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RegisterForm from "./register-form"
import { eventsApi, registrationApi } from "../../lib/api" // Import the API from api.jsx

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [participationCount, setParticipationCount] = useState(0)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  // Separate useEffect for event data fetching
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        // Fetch event data using eventsApi.getById
        const response = await eventsApi.getById(id)
        
        // Map backend fields to our component's expected structure
        const eventData = response.data;
        const formattedEvent = {
          id: eventData.id,
          title: eventData.event_name,
          type: eventData.category,
          date: `${eventData.important_dates?.start_date}${eventData.important_dates?.end_date !== eventData.important_dates?.start_date ? 
            ` to ${eventData.important_dates?.end_date}` : ''}`,
          time: eventData.event_time || "All day",
          location: eventData.venue,
          image: eventData.image_url || "/api/placeholder/320/180",
          status: new Date(eventData.registration_deadline) > new Date() ? "upcoming" : "closed",
          department: eventData.department,
          maxRegistrations: eventData.max_participants || 100,
          isTechnical: eventData.category === "Technical",
          isFree: eventData.registration_fee === 0,
          registrationFee: eventData.registration_fee > 0 ? `₹${eventData.registration_fee}` : "Free",
          teamEvent: eventData.participation_type === "Team",
          teamSize: { 
            min: eventData.min_team_size || 1, 
            max: eventData.max_team_size || 1 
          },
          prize: eventData.prizes ? `₹${eventData.prizes.first || ""}` : "",
          organizer: eventData.organizer,
          contact: eventData.contact_info,
          description: eventData.event_description,
          rules: eventData.rules ? eventData.rules.replace(/\n/g, '<br>') : "",
          registrationCloses: new Date(eventData.registration_deadline).toLocaleDateString(undefined, 
            { year: "numeric", month: "long", day: "numeric" }),
          created_at: eventData.created_at,
          event_type: eventData.event_type,
          // Create a timeline from available dates
          timeline: [
            { 
              time: "Registration Deadline", 
              event: new Date(eventData.registration_deadline).toLocaleDateString(undefined, 
                { year: "numeric", month: "long", day: "numeric" })
            },
            { 
              time: "Event Start", 
              event: new Date(eventData.important_dates?.start_date).toLocaleDateString(undefined, 
                { year: "numeric", month: "long", day: "numeric" })
            }
          ]
        }
        
        if (eventData.important_dates?.end_date !== eventData.important_dates?.start_date) {
          formattedEvent.timeline.push({
            time: "Event End",
            event: new Date(eventData.important_dates?.end_date).toLocaleDateString(undefined, 
              { year: "numeric", month: "long", day: "numeric" })
          })
        }
        
        setEvent(formattedEvent)
        
        // Fetch participation count for the event
        try {
          const countResponse = await eventsApi.getEventParticipationCount(id)
          setParticipationCount(countResponse.data.count || 0)
        } catch (countError) {
          console.error("Error fetching participation count:", countError)
          setParticipationCount(0)
        }
        
      } catch (err) {
        console.error("Error fetching event data:", err)
        setError("Failed to load event details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [id])

  // Separate useEffect for authentication and registration status
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated by looking for user token
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
      setIsAuthenticated(!!token)
      return !!token
    }
    
    const checkRegistration = async () => {
      try {
        // Fetch user registrations to check if already registered
        const registrationsResponse = await registrationApi.getUserRegistrations()
        const registrations = registrationsResponse.data
        
        // Check if user is registered for this event
        // Compare as strings to ensure type safety
        const currentEventId = String(id)
        
        // Debug logs to help identify the issue
        
        
        // Check registration using both property names that might be used
        const isUserRegistered = registrations.some(reg => 
          String(reg.eventId) === currentEventId || 
          String(reg.event_id) === currentEventId
        )
        
        
        setIsRegistered(isUserRegistered)
      } catch (err) {
        console.error("Error checking registration status:", err)
        setIsRegistered(false)
      }
    }

    // First check auth status
    const isUserAuth = checkAuth()
    
    // Only check registration if user is authenticated
    if (isUserAuth) {
      checkRegistration()
    } else {
      // Reset registration status if not authenticated
      setIsRegistered(false)
    }
    
    // Setup event listener for storage changes (login/logout)
    const handleStorageChange = () => {
      const wasAuthenticated = isAuthenticated
      const nowAuthenticated = checkAuth()
      
      // If authentication status changed
      if (wasAuthenticated !== nowAuthenticated) {
        if (nowAuthenticated) {
          // User just logged in, check registration
          checkRegistration()
        } else {
          // User logged out, reset registration status
          setIsRegistered(false)
        }
      }
    }
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for login/logout from within the same tab
    window.addEventListener('authStatusChange', handleStorageChange)
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStatusChange', handleStorageChange)
    }
  }, [id, isAuthenticated])

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      // Store current page URL to redirect back after login
      navigate("/login", { state: { redirectTo: `/event-details/${id}` } })
    } else {
      setShowRegisterDialog(true)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    
    try {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
        </main>
        <Footer />
      </div>
    )
  }
  
  
  
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Event</h2>
            <p className="text-gray-600 mb-6">{error || "Event not found"}</p>
            <Button onClick={() => navigate("/events")}>Back to Events</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const registrationProgress = Math.min(100, ((participationCount / (event.maxRegistrations || 100)) * 100))

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={event.image || "/api/placeholder/320/180"} 
              alt={event.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent flex flex-col justify-end p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{event.department || "Department"}</Badge>
                <Badge variant="secondary">{event.type || "Event"}</Badge>
                <Badge variant="outline" className="bg-white/80">
                  {event.teamEvent 
                    ? `Team (${event.teamSize?.min || 1}-${event.teamSize?.max || 1})` 
                    : "Individual"}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl text-white font-bold">{event.title}</h1>
              <div className="flex flex-wrap mt-4 gap-x-6 gap-y-2 text-white/90">
                <div className="flex items-center">
                  <CalendarClock size={16} className="mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6 bg-[#e0f2fe] text-[#003366]">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-5 bg-white shadow-sm">
                      <div className="flex items-center text-[#003366] mb-4">
                        <Users size={22} className="mr-2" />
                        <h3 className="font-semibold text-lg">Registration</h3>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">{event.status === "upcoming" ? "Open" : event.status}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Registration Fee:</span>
                          <span className="font-medium">{event.isFree ? "Free" : event.registrationFee}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Team Size:</span>
                          <span className="font-medium">
                            {event.teamEvent ? `${event.teamSize?.min || 1}-${event.teamSize?.max || 1} members` : "Individual"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Spots Remaining:</span>
                          <span className="font-medium">{(event.maxRegistrations || 0) - participationCount}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-5 bg-white shadow-sm">
                      <div className="flex items-center text-[#003366] mb-4">
                        <Award size={22} className="mr-2" />
                        <h3 className="font-semibold text-lg">Prizes & Details</h3>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {event.prizes && (
                          <>
                            <li className="flex justify-between">
                              <span className="text-gray-600">First Prize:</span>
                              <span className="font-medium">{event.prizes.first || event.prize}</span>
                            </li>
                            {event.prizes.second && (
                              <li className="flex justify-between">
                                <span className="text-gray-600">Second Prize:</span>
                                <span className="font-medium">{event.prizes.second}</span>
                              </li>
                            )}
                            {event.prizes.third && (
                              <li className="flex justify-between">
                                <span className="text-gray-600">Third Prize:</span>
                                <span className="font-medium">{event.prizes.third}</span>
                              </li>
                            )}
                          </>
                        )}
                        {!event.prizes && event.prize && (
                          <li className="flex justify-between">
                            <span className="text-gray-600">Prize Pool:</span>
                            <span className="font-medium">{event.prize}</span>
                          </li>
                        )}
                        <li className="flex justify-between">
                          <span className="text-gray-600">Organizer:</span>
                          <span className="font-medium">{event.organizer}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{event.contact}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Registrations:</span>
                          <span className="font-medium">
                            {participationCount}/{event.maxRegistrations || '∞'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rules">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.rules }} />
                  {!event.rules && (
                    <div className="text-gray-500 italic">
                      No specific rules have been provided for this event.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="relative border-l-2 border-gray-200 pl-5 ml-6 space-y-8">
                    {(event.timeline || []).map((item, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[28px] bg-[#003366] text-white w-10 h-10 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="bg-[#f3f4f6] p-4 rounded-lg shadow-sm">
                          <p className="font-semibold">{item.time}</p>
                          <p className="text-gray-700">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 border rounded-xl overflow-hidden bg-white shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-[#003366]">Join this Event</h2>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Registration Progress</span>
                      <span>
                        {participationCount}/{event.maxRegistrations || '∞'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#003366] h-2 rounded-full"
                        style={{ width: `${registrationProgress}%` }}
                      />
                    </div>
                  </div>

                  {event.maxRegistrations && participationCount >= event.maxRegistrations ? (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This event is fully booked. No more registrations are being accepted.
                      </AlertDescription>
                    </Alert>
                  ) : isRegistered ? (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <AlertDescription className="text-[#003366]">
                        You are already registered for this event. Check your dashboard for details.
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="space-y-3">
                    {isRegistered ? (
                      <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                        View Registration
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-[#003366] text-white hover:bg-[#002a52]"
                        onClick={handleRegisterClick}
                        disabled={
                          isRegistered || 
                          (event.maxRegistrations && participationCount >= event.maxRegistrations) || 
                          event.status === "completed"
                        }
                      >
                        {isAuthenticated ? "Register Now" : "Login to Register"}
                      </Button>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f9fafb] p-4 border-t">
                  <h3 className="font-medium mb-3 text-[#003366]">Important Dates</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Registration Deadline:</span>
                      <span className="font-medium">
                        {event.registrationCloses}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Event Date:</span>
                      <span className="font-medium">{event.date}</span>
                    </li>
                    {event.created_at && (
                      <li className="flex justify-between">
                        <span className="text-gray-600">Posted On:</span>
                        <span className="font-medium">
                          {new Date(event.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#003366]">Register for {event.title}</DialogTitle>
          </DialogHeader>
          {isRegistered ? (
            <div className="py-4">
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-[#003366]">
                  You are already registered for this event. Check your dashboard for details.
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full bg-[#003366] text-white hover:bg-[#002a52]" 
                onClick={() => {
                  setShowRegisterDialog(false)
                  navigate("/dashboard")
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <RegisterForm
              event={event}
              onSuccess={() => {
                setIsRegistered(true)
                setShowRegisterDialog(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
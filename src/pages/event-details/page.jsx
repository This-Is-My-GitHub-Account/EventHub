"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  CalendarClock,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Share2,
  Heart,
  Award,
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

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  useEffect(() => {
    // Check if event data was passed through navigation state
    const passedEventData = location.state?.eventData

    if (passedEventData) {
      // Use the passed event data
      const fullEventData = {
        ...passedEventData,
        department: passedEventData.department || "Computer Engineering",
        departmentId: passedEventData.departmentId || "cs",
        maxRegistrations: passedEventData.maxRegistrations || 150,
        isTechnical: passedEventData.type === "Technical",
        isFree: passedEventData.registrationFee ? false : true,
        registrationFee: passedEventData.registrationFee || "₹500",
        teamEvent: passedEventData.teamEvent !== undefined ? passedEventData.teamEvent : true,
        teamSize: passedEventData.teamSize || { min: 2, max: 4 },
        prize: passedEventData.prize || "₹20,000",
        organizer: passedEventData.organizer || "Tech Club",
        contact: passedEventData.contact || "techclub@college.edu",
        image: passedEventData.image || "/api/placeholder/320/180",
        description: passedEventData.description || `
          <p>Join us for the biggest hackathon of the year! Build innovative solutions to real-world problems in just 24 hours.</p>
          <p>This is an opportunity to showcase your coding skills, collaborate with talented peers, and win exciting prizes.</p>
          <h3>Problem Statements:</h3>
          <ul>
            <li>Smart Campus Solutions</li>
            <li>Healthcare Innovations</li>
            <li>Fintech Applications</li>
            <li>Sustainable Development</li>
          </ul>
          <h3>Judging Criteria:</h3>
          <ul>
            <li>Innovation and Creativity (30%)</li>
            <li>Technical Complexity (25%)</li>
            <li>Practicality and Implementation (25%)</li>
            <li>Presentation (20%)</li>
          </ul>
        `,
        rules: passedEventData.rules || `
          <ol>
            <li>Teams must consist of 2-4 members.</li>
            <li>All team members must be currently enrolled students.</li>
            <li>Code must be original and developed during the hackathon.</li>
            <li>Use of open-source libraries and APIs is allowed.</li>
            <li>Final submission must include source code and presentation.</li>
            <li>Judges' decision will be final and binding.</li>
          </ol>
        `,
        timeline: passedEventData.timeline || [
          { time: "08:30 AM", event: "Registration & Check-in" },
          { time: "09:00 AM", event: "Opening Ceremony" },
          { time: "09:30 AM", event: "Hackathon Begins" },
          { time: "01:00 PM", event: "Lunch Break" },
          { time: "06:00 PM", event: "Dinner" },
          { time: "09:00 AM (Next Day)", event: "Submission Deadline" },
          { time: "10:00 AM - 12:00 PM", event: "Presentations" },
          { time: "01:00 PM", event: "Prize Distribution & Closing Ceremony" },
        ],
      }
      
      setEvent(fullEventData)
      setLoading(false)
    } else {
      // Fallback to fetch if no state data provided
      setTimeout(() => {
        // Create a default event based on id
        const defaultEvent = {
          id: id,
          title: "Event " + id,
          type: "Technical",
          date: "April 15, 2025",
          time: "9:00 AM - 6:00 PM",
          location: "Main Auditorium",
          registrations: 78,
          image: "/api/placeholder/320/180",
          status: "upcoming",
          department: "Computer Engineering",
          departmentId: "cs",
          maxRegistrations: 150,
          isTechnical: true,
          isFree: false,
          registrationFee: "₹500",
          teamEvent: true,
          teamSize: { min: 2, max: 4 },
          prize: "₹20,000",
          organizer: "Tech Club",
          contact: "techclub@college.edu",
          description: `<p>Default event description for event ID ${id}.</p>`,
          rules: `<ol><li>Default rules for event ID ${id}.</li></ol>`,
          timeline: [
            { time: "09:00 AM", event: "Opening Ceremony" },
            { time: "01:00 PM", event: "Closing Ceremony" },
          ],
        }
        
        setEvent(defaultEvent)
        setLoading(false)
      }, 500)
    }

    const checkAuth = () => {
      setIsAuthenticated(true)
    }

    const checkRegistration = () => {
      setIsRegistered(false)
    }

    checkAuth()
    checkRegistration()
  }, [id, location.state])

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/event-details/${id}` } })
    } else {
      setShowRegisterDialog(true)
    }
  }

  const formatDate = (dateString) => {
    // If dateString is already formatted (like "April 15, 2025"), return it as is
    if (dateString && !dateString.includes("-")) {
      return dateString
    }
    
    // Otherwise format date from ISO format
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent flex flex-col justify-end p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{event.department}</Badge>
                <Badge variant="secondary">{event.type}</Badge>
                <Badge variant="outline" className="bg-white/80">
                  {event.teamEvent ? `Team (${event.teamSize.min}-${event.teamSize.max})` : "Individual"}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl text-white font-bold">{event.title}</h1>
              <div className="flex flex-wrap mt-4 gap-x-6 gap-y-2 text-white/90">
                <div className="flex items-center">
                  <CalendarClock size={16} className="mr-2" />
                  <span>{formatDate(event.date)}</span>
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
                            {event.teamEvent ? `${event.teamSize.min}-${event.teamSize.max} members` : "Individual"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Spots Remaining:</span>
                          <span className="font-medium">{event.maxRegistrations - event.registrations}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-5 bg-white shadow-sm">
                      <div className="flex items-center text-[#003366] mb-4">
                        <Award size={22} className="mr-2" />
                        <h3 className="font-semibold text-lg">Prizes & Details</h3>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Prize Pool:</span>
                          <span className="font-medium">{event.prize}</span>
                        </li>
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
                            {event.registrations}/{event.maxRegistrations}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rules">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.rules }} />
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="relative border-l-2 border-gray-200 pl-5 ml-6 space-y-8">
                    {event.timeline.map((item, index) => (
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
                        {event.registrations}/{event.maxRegistrations}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#003366] h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.maxRegistrations) * 100}%` }}
                      />
                    </div>
                  </div>

                  {event.registrations >= event.maxRegistrations ? (
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
                        disabled={event.registrations >= event.maxRegistrations || event.status === "completed"}
                      >
                        Register Now
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
                      <span className="text-gray-600">Registration Closes:</span>
                      <span className="font-medium">
                        {event.registrationCloses || formatDate(new Date(new Date(event.date).getTime() - 86400000).toISOString())}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Event Date:</span>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </li>
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
          <RegisterForm
            event={event}
            onSuccess={() => {
              setIsRegistered(true)
              setShowRegisterDialog(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
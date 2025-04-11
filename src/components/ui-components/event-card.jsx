import { CalendarClock, MapPin, Users, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export default function EventCard({ event, compact = false }) {
  // If no event is provided, use default values
  const defaultEvent = {
    id: 1,
    title: "Hackathon 2023",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-07-15",
    time: "09:00 AM - 06:00 PM",
    location: "Main Auditorium",
    department: "Computer Engineering",
    registrations: 120,
    maxRegistrations: 150,
    isTechnical: true,
    isFree: false,
    registrationFee: "₹500",
    teamEvent: true,
    teamSize: "2-4",
  }

  const eventData = event || defaultEvent

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (compact) {
    return (
      <Link to={`/event-details/${eventData.id}`} className="block">
        <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-40">
            <img
              src={eventData.image || "/placeholder.svg"}
              alt={eventData.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 right-2">{eventData.isTechnical ? "Technical" : "Non-Technical"}</Badge>
          </div>
          <div className="p-3">
            <h3 className="font-medium truncate">{eventData.title}</h3>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <CalendarClock size={14} className="mr-1" />
              <span>{formatDate(eventData.date)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge variant="outline">{eventData.department}</Badge>
              <span className="text-xs font-medium">{eventData.isFree ? "Free" : eventData.registrationFee}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/event-details/${eventData.id}`} className="block">
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <img
            src={eventData.image || "/placeholder.svg"}
            alt={eventData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent">
            <Badge className="mb-2">{eventData.isTechnical ? "Technical" : "Non-Technical"}</Badge>
            <h3 className="text-white font-bold text-xl">{eventData.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarClock size={16} className="mr-2" />
              <span>{formatDate(eventData.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{eventData.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>{eventData.location}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>{eventData.teamEvent ? `Team (${eventData.teamSize})` : "Individual"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Badge variant="outline">{eventData.department}</Badge>
            <div className="text-right">
              <div className="text-xs text-gray-500">Registration</div>
              <div className="font-semibold">{eventData.isFree ? "Free" : eventData.registrationFee}</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Registrations</span>
              <span>
                {eventData.registrations}/{eventData.maxRegistrations}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${(eventData.registrations / eventData.maxRegistrations) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

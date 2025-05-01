import { Calendar, MapPin, Users } from "lucide-react";

export default function EventCard({ event }) {
  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusColors = {
      upcoming: "bg-[#d5efe6] text-[#2c7873]",
      ongoing: "bg-[#d5efe6] text-[#2c7873]",
      completed: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  const handleViewEvent = (event) => {     navigate(`/event-details/${event.id}`)   }
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          {renderStatusBadge(event.status)}
        </div>
      </div>
      
      {/* Event Content */}
      <div className="p-5">
        {/* Event Type */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-[#2c7873] uppercase tracking-wider bg-[#d5efe6] px-2 py-1 rounded">
            {event.type}
          </span>
          <span className="text-sm font-medium text-[#2c7873]">
            {event.department}
          </span>
        </div>
        
        {/* Event Title */}
        <h3 className="text-lg font-bold mb-3 line-clamp-2 text-black">{event.title}</h3>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar size={16} className="mr-2 text-[#2c7873]" />
            <span>{event.date}</span>
            <span className="mx-1">•</span>
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <MapPin size={16} className="mr-2 text-[#2c7873]" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Users size={16} className="mr-2 text-[#2c7873]" />
            <span>{event.registrations} registrations</span>
          </div>
        </div>
        
        {/* Button - Replaced Link with a button that calls handleViewEvent */}
        <button
          onClick={() => handleViewEvent(event)}
          className="block w-full py-2 px-4 text-center text-white font-medium rounded-md transition-colors duration-300 bg-[#2c7873] hover:bg-opacity-90"
        >
          {event.status === "completed" ? "View Details" : "Register Now"}
        </button>
      </div>
    </div>
  );
}
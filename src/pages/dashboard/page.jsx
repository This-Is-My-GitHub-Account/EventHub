import { Badge } from "@/components/ui/badge"
import { Calendar, BellRing, Award, BarChart3, CalendarClock, Users } from "lucide-react"
import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import ProfileSection from "./profile-section"
import MyEvents from "./my-events"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function DashboardPage() {
  const dashboardData = {
    eventsRegistered: 2,
    eventsCreated: 1,
    upcomingEvents: 1,
    notifications: [
      {
        id: 1,
        title: "Registration Confirmed",
        message: "Your registration for Hackathon 2023 has been confirmed.",
        date: "2023-07-01",
        read: false,
      },
      {
        id: 2,
        title: "New Team Member",
        message: "Jane Smith has joined your team for Hackathon 2023.",
        date: "2023-07-02",
        read: true,
      },
    ],
    upcomingEventsData: [
      {
        id: 1,
        title: "Hackathon 2023",
        date: "2023-07-15",
        daysLeft: 12,
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>

          {/* Stats Section - Redesigned to be more subtle */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center p-4 bg-white border border-[#d5efe6] rounded-lg shadow-sm flex-1 min-w-[180px]">
              <div className="p-3 rounded-full bg-[#d5efe6] mr-4">
                <Users className="h-6 w-6 text-[#2c7873]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Events Registered</p>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-black mr-2">{dashboardData.eventsRegistered}</span>
                  <span className="text-xs text-[#2c7873] font-medium bg-[#d5efe6] px-2 py-1 rounded-full">
                    {dashboardData.upcomingEvents} upcoming
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white border border-[#d5efe6] rounded-lg shadow-sm flex-1 min-w-[180px]">
              <div className="p-3 rounded-full bg-[#d5efe6] mr-4">
                <BarChart3 className="h-6 w-6 text-[#2c7873]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Events Created</p>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-black">{dashboardData.eventsCreated}</span>
                </div>
              </div>
            </div>

            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProfileSection />
              <MyEvents />
            </div>

            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white border border-[#d5efe6] rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#d5efe6] flex items-center justify-between">
                  <h3 className="font-medium text-black flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#2c7873]" />
                    Upcoming Events
                  </h3>
                </div>
                
                <div className="p-4">
                  {dashboardData.upcomingEventsData.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.upcomingEventsData.map((event) => (
                        <div key={event.id} className="flex justify-between items-center py-2 border-b border-[#d5efe6] last:border-0">
                          <div>
                            <Link
                              to={`/event-details/${event.id}`}
                              className="font-medium text-black hover:text-[#2c7873] transition-colors"
                            >
                              {event.title}
                            </Link>
                            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <Badge className="bg-[#d5efe6] text-[#2c7873] border-none">
                            {event.daysLeft} days left
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No upcoming events</p>
                      <Link to="/events">
                        <Button variant="link" className="mt-2 text-[#2c7873]">Browse Events</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-[#d5efe6] rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#d5efe6] flex items-center justify-between">
                  <h3 className="font-medium text-black flex items-center">
                    <BellRing className="mr-2 h-5 w-5 text-[#2c7873]" />
                    Notifications
                  </h3>
                  <Badge className="bg-[#2c7873] text-white">{dashboardData.notifications.length}</Badge>
                </div>
                
                <div className="p-4">
                  {dashboardData.notifications.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-md ${
                            notification.read
                              ? "bg-gray-50"
                              : "bg-[#d5efe6] border-l-4 border-[#2c7873]"
                          }`}
                        >
                          <div className="font-medium text-black">{notification.title}</div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white border border-[#d5efe6] rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#d5efe6]">
                  <h3 className="font-medium text-black flex items-center">
                    <Award className="mr-2 h-5 w-5 text-[#2c7873]" />
                    Your Achievements
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#d5efe6] flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-[#2c7873]" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Complete your profile and participate in events to earn achievements
                    </p>
                    <Link to="/events">
                      <Button className="bg-[#2c7873] hover:bg-[#1c5853] text-white">Explore Events</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
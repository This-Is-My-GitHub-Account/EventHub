"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // For demo purposes, replace with actual auth state
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    // You would typically navigate to search results page
    // navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  // Colors from the theme
  const colors = {
    primary: "#2c7873", // Teal for primary actions
    primaryLight: "#d5efe6", // Light mint green for backgrounds
    secondary: "#fde8e6", // Soft pink for secondary elements
    textPrimary: "#000000", // Black for primary text
  }

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-4xl font-bold">
              <span className="text-black">Event</span>
              <span style={{ color: colors.primary }}>Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-primary transition-colors relative py-2 ${
                isActive("/") ? "font-medium" : ""
              }`}
              style={{
                color: isActive("/") ? colors.primary : undefined,
              }}
            >
              Home
              {isActive("/") && (
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5"
                  style={{ backgroundColor: colors.primary }}
                ></span>
              )}
            </Link>
            <Link
              to="/events"
              className={`text-gray-700 hover:text-primary transition-colors relative py-2 ${
                isActive("/events") ? "font-medium" : ""
              }`}
              style={{
                color: isActive("/events") ? colors.primary : undefined,
              }}
            >
              Events
              {isActive("/events") && (
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5"
                  style={{ backgroundColor: colors.primary }}
                ></span>
              )}
            </Link>
            <Link
              to="/create-event"
              className={`text-gray-700 hover:text-primary transition-colors relative py-2 ${
                isActive("/create-event") ? "font-medium" : ""
              }`}
              style={{
                color: isActive("/create-event") ? colors.primary : undefined,
              }}
            >
              Host Events
              {isActive("/create-event") && (
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5"
                  style={{ backgroundColor: colors.primary }}
                ></span>
              )}
            </Link>
          </nav>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 h-9 w-[200px] lg:w-[250px] rounded-md border-gray-200 focus-visible:ring-1 focus-visible:ring-offset-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  "--tw-ring-color": colors.primary,
                  "--tw-ring-offset-color": "white",
                }}
              />
            </form>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Button style={{ backgroundColor: colors.primary }}>
                  <Link to="/host" className="flex items-center">
                    Add Your Event
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/dashboard" className="w-full">
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/my-events" className="w-full">
                        My Events
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button className="w-full text-left" onClick={() => setIsLoggedIn(false)}>
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-black">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button style={{ backgroundColor: colors.primary }}>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 rounded-md border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`text-gray-700 hover:text-primary transition-colors py-2 ${
                  isActive("/") ? "font-medium" : ""
                }`}
                style={{
                  color: isActive("/") ? colors.primary : undefined,
                  borderLeft: isActive("/") ? `3px solid ${colors.primary}` : "none",
                  paddingLeft: isActive("/") ? "0.5rem" : "0",
                }}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`text-gray-700 hover:text-primary transition-colors py-2 ${
                  isActive("/events") ? "font-medium" : ""
                }`}
                style={{
                  color: isActive("/events") ? colors.primary : undefined,
                  borderLeft: isActive("/events") ? `3px solid ${colors.primary}` : "none",
                  paddingLeft: isActive("/events") ? "0.5rem" : "0",
                }}
              >
                Events
              </Link>
              <Link
                to="/create-event"
                className={`text-gray-700 hover:text-primary transition-colors py-2 ${
                  isActive("/create-event") ? "font-medium" : ""
                }`}
                style={{
                  color: isActive("/create-event") ? colors.primary : undefined,
                  borderLeft: isActive("/create-event") ? `3px solid ${colors.primary}` : "none",
                  paddingLeft: isActive("/create-event") ? "0.5rem" : "0",
                }}
              >
                Host Events
              </Link>
            </nav>

            {isLoggedIn ? (
              <div className="space-y-3 pt-2">
                <Link to="/host" className="block">
                  <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                    Add Your Event
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full border-gray-200">
                    My Dashboard
                  </Button>
                </Link>
                <button
                  className="w-full py-2 text-sm text-gray-600 hover:text-primary"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full border-gray-200">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

"use client";

import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Bell, LogOut, User, LayoutDashboard, CalendarPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

// Helper function to get initials for Avatar Fallback
const getInitials = (name = "") => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'UN'; // Default to 'UN' if no name
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
 
  const { currentUser, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return; // Don't search if query is empty
    console.log("Searching for:", searchQuery);
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    // Optionally clear search or close mobile menu
    // setSearchQuery("");
    // handleMobileLinkClick();
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    handleMobileLinkClick(); // Close mobile menu if open
  };

  // Check if a link is active (more robust check for nested routes if needed)
  const isActive = (path) => {
    // Simple check for exact match or startsWith for broader matching (e.g., /events/*)
    // return location.pathname === path || location.pathname.startsWith(path + '/');
    return location.pathname === path;
  };

  // Define NavLink component for less repetition
  const NavLink = ({ to, children }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        onClick={handleMobileLinkClick} // Close menu on mobile click
        className={`relative py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-primary ${
          active ? "text-primary" : "text-gray-600"
        }`}
      >
        {children}
        {active && (
          <span
            className="absolute bottom-0 left-0 hidden h-0.5 w-full bg-primary md:block" // Underline only on desktop
            aria-hidden="true"
          ></span>
        )}
        {active && (
          <span
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary md:hidden" // Left border only on mobile
            aria-hidden="true"
          ></span>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={handleMobileLinkClick}>
            {/* Optional: Add an actual logo icon if you have one */}
            {/* <img src="/logo.svg" alt="EventHub Logo" className="h-8 w-auto" /> */}
             <span className="text-2xl font-bold tracking-tight md:text-3xl">
              <span className="text-gray-900">Event</span>
              <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex lg:space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            {/* Show Host Events/Create Event only if logged in */}
            {isAuthenticated && <NavLink to="/create-event">Host Event</NavLink>}
          </nav>

          {/* Search and User Actions (Desktop) */}
          <div className="hidden items-center space-x-3 md:flex lg:space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search events..."
                className="h-9 w-[180px] rounded-md border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary lg:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link to="/create-event">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {/* Replace '3' with dynamic notification count if available */}
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    3
                  </span>
                  <span className="sr-only">View notifications</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 cursor-pointer border border-gray-200">
                        <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.name || "User"} />
                        <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser?.name || "User"}</p>
                        {currentUser?.email && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {currentUser.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/my-events">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        <span>My Events</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={toggleMenu}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="pb-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="h-10 w-full rounded-md border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-1">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/events">Events</NavLink>
                {isAuthenticated && <NavLink to="/create-event">Host Event</NavLink>}
              </nav>
            </div>

            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {isAuthenticated ? (
                <div className="space-y-3 px-2 sm:px-3">
                  <div className="flex items-center px-2">
                    <Avatar className="h-10 w-10 cursor-pointer border border-gray-200">
                      <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.name || "User"} />
                      <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{currentUser?.name || "User"}</div>
                      {currentUser?.email && <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>}
                    </div>
                    <Button variant="ghost" size="icon" className="relative ml-auto flex-shrink-0 rounded-full hover:bg-gray-100">
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6 text-gray-600" />
                      {/* Add notification count here if needed */}
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">3</span>
                    </Button>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Button asChild variant="ghost" className="w-full justify-start text-base text-gray-600 hover:bg-gray-100 hover:text-primary">
                      <Link to="/dashboard" onClick={handleMobileLinkClick}><LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-base text-gray-600 hover:bg-gray-100 hover:text-primary">
                      <Link to="/my-events" onClick={handleMobileLinkClick}><CalendarPlus className="mr-3 h-5 w-5" /> My Events</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-base text-gray-600 hover:bg-gray-100 hover:text-primary">
                      <Link to="/profile" onClick={handleMobileLinkClick}><User className="mr-3 h-5 w-5" /> Profile</Link>
                    </Button>
                    <Button asChild className="mt-2 w-full bg-primary hover:bg-primary/90">
                      <Link to="/create-event" onClick={handleMobileLinkClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-base text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="mr-3 h-5 w-5" /> Logout
                    </Button>
                  </div>
                </div>
              ) : (
                // Logged out state mobile
                <div className="space-y-2 px-2 pt-2 sm:px-3">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link to="/signup" onClick={handleMobileLinkClick}>Sign Up</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={handleMobileLinkClick}>Login</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
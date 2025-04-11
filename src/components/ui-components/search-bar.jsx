"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function SearchBar({ placeholder = "Search events...", fullWidth = false, showIcon = true }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Mock event data for search results - in a real app, this would come from an API call
  const mockEvents = [
    { id: 1, title: "Hackathon 2023", department: "Computer Engineering" },
    { id: 2, title: "Robotics Workshop", department: "Electronics & Telecommunication" },
    { id: 3, title: "Bridge Design Competition", department: "Civil Engineering" },
    { id: 4, title: "Code Quest", department: "Computer Engineering" },
    { id: 5, title: "Circuit Design Challenge", department: "Electronics & Telecommunication" },
    { id: 6, title: "Machine Learning Masterclass", department: "Computer Engineering" },
  ]

  useEffect(() => {
    // Filter events based on search term
    if (searchTerm.length > 0) {
      const filteredResults = mockEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(filteredResults)
      setIsSearching(true)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchTerm])

  useEffect(() => {
    // Close search results when clicking outside
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`)
      setIsSearching(false)
    }
  }

  const handleResultClick = (eventId) => {
    navigate(`/event-details/${eventId}`)
    setSearchTerm("")
    setIsSearching(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsSearching(false)
  }

  return (
    <div ref={searchRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          {showIcon && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => searchTerm && setIsSearching(true)}
            placeholder={placeholder}
            className={`${showIcon ? "pl-10" : "pl-4"} pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
          <ul className="py-1">
            {searchResults.map((event) => (
              <li
                key={event.id}
                onClick={() => handleResultClick(event.id)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-gray-500">{event.department}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSearching && searchResults.length === 0 && searchTerm && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border">
          <div className="px-4 py-3 text-sm text-gray-500">No events found</div>
        </div>
      )}
    </div>
  )
}

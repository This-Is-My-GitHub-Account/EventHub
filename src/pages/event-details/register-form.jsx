"use client"

import { useState, useEffect } from "react"
import { X, User, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registrationApi, authApi } from "../../lib/api"
import { toast } from "sonner"

export default function RegisterForm({ event, onSuccess }) {
  const [formData, setFormData] = useState({
    teamName: "",
    teamMembers: [],
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authApi.getProfile()
        if (response.data) {
          setCurrentUser(response.data)
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
        toast.error("Failed to fetch user profile")
      }
    }

    fetchCurrentUser()
  }, [])

  // Determine if this is a team event
  
  const isTeamEvent = event.teamEvent;
  
  
  // Set default team name for solo events
  useEffect(() => {
    if (!isTeamEvent && currentUser) {
      setFormData(prev => ({
        ...prev,
        teamName: `Individual-${currentUser.id}`
      }))
    }
  }, [isTeamEvent, currentUser])

  const handleSearchUser = async (query) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        // For email searches, use the getUserIdByEmail endpoint
        if (query.includes('@')) {
          try {
            const response = await authApi.getUserIdByEmail(query)
            if (response.data) {
              // Make sure the user is not already in the team or the current user
              if (!formData.teamMembers.some(member => member.id === response.data.id) && 
                  response.data.id !== currentUser?.id) {
                setSearchResults([response.data])
              } else {
                setSearchResults([])
                toast.info("This user is already part of your team")
              }
            } else {
              setSearchResults([])
            }
          } catch (error) {
            console.error("Error finding user by email:", error)
            if (error.response && error.response.status === 404) {
              toast.error("No user found with this email address")
            } else {
              toast.error("Failed to search by email")
            }
            setSearchResults([])
          }
        } else {
          // For non-email searches, we'd need a general search endpoint
          // Since this doesn't seem to be implemented yet, show a message to use email
          toast.info("Please enter a complete email address to find users")
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error searching users:", error)
        toast.error("Failed to search users")
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const handleAddTeamMember = (user) => {
    // Prevent adding duplicates or the current user
    if (
      formData.teamMembers.some((member) => member.id === user.id) ||
      user.id === currentUser?.id
    ) {
      return
    }

    const newMember = { id: user.id, name: user.name, email: user.email }
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, newMember],
    })
    setSearchQuery("")
    setSearchResults([])
  }

  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...formData.teamMembers]
    updatedMembers.splice(index, 1)
    setFormData({
      ...formData,
      teamMembers: updatedMembers,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear specific error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setErrors({})
    
    try {
      // Validate form data
      let validationErrors = {}
      
      if (isTeamEvent && !formData.teamName.trim()) {
        validationErrors.team_name = "Team name is required"
      }
      
      // Team size validation
      const totalTeamSize = formData.teamMembers.length + 1 // +1 for current user
      if (isTeamEvent && event.min_team_size && totalTeamSize < event.min_team_size) {
        validationErrors.member_ids = `Team must have at least ${event.min_team_size} members`
      }
      
      if (isTeamEvent && event.max_team_size && totalTeamSize > event.max_team_size) {
        validationErrors.member_ids = `Team cannot have more than ${event.max_team_size} members`
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        throw new Error("Please fix the validation errors")
      }
      
      // Get member IDs
      const memberIds = formData.teamMembers.map(member => member.id)
      
      // Add current user's ID if not already included
      if (currentUser && !memberIds.includes(currentUser.id)) {
        memberIds.unshift(currentUser.id) // Add current user as first member
      }
      
      // Prepare registration data according to your API structure
      const registrationData = {
        event_id: event.id,
        team_name: formData.teamName,
        member_ids: memberIds,
      }
      
     
      const response = await registrationApi.register(registrationData)
      
      // Call the onSuccess callback with the response data
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      toast.success("Registration Complete", {
        description: "You have successfully registered for this event.",
      })
      
    } catch (error) {
      console.error("Registration error:", error)
      
      // Handle API errors
      if (error.response && error.response.data) {
        setErrors(prevErrors => ({
          ...prevErrors,
          ...(error.response.data.errors || { general: error.response.data.message })
        }))
      } else if (!Object.keys(errors).length) {
        // Only set generic error if we don't have specific validation errors
        setErrors({ 
          general: error.message || "An error occurred during registration." 
        })
      }
      
      toast.error("Registration Failed", {
        description: errors.general || error.response?.data?.message || error.message || "Failed to complete registration.",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  // Calculate if the team is valid based on event requirements
  const isTeamValid = () => {
    if (!isTeamEvent) return true
    
    // Check team name
    if (!formData.teamName.trim()) return false
    
    // Calculate total team size including the current user
    const totalTeamSize = formData.teamMembers.length + 1
    
    // Check team size constraints
    const minTeamSize = event?.min_team_size || 1
    if (minTeamSize && totalTeamSize < minTeamSize) return false
    if (event?.max_team_size && totalTeamSize > event.max_team_size) return false
    
    return true
  }

  // If user is not loaded yet, show loading state
  if (!currentUser) {
    return <div className="p-4 text-center">Loading your profile...</div>
  }
  
  // Default to reasonable team size if event object is incomplete
  const maxTeamSize = event?.max_team_size || 5
  const minTeamSize = event?.min_team_size || 1
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6 rounded-xl shadow-md space-y-6"
    >
      {errors.general && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md">
          {errors.general}
        </div>
      )}
      
      {/* User Information Section */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-[#003366]">Your Information</h3>
        <div className="bg-white p-3 rounded-md border border-blue-100">
          <div className="font-medium text-[#003366]">{currentUser.name}</div>
          <div className="text-sm text-gray-500">{currentUser.email}</div>
          {isTeamEvent && <div className="text-xs text-green-600">Team Leader</div>}
        </div>

        {!event?.isFree && (
          <div className="grid gap-2 mt-2">
            <Label htmlFor="participantPhone">Contact Phone Number</Label>
            <Input
              id="participantPhone"
              name="participantPhone"
              type="tel"
              value={formData.participantPhone}
              onChange={handleInputChange}
              required
              className="bg-[#e0f2fe] text-[#003366]"
            />
            {errors.participantPhone && (
              <p className="text-sm text-red-500">{errors.participantPhone}</p>
            )}
          </div>
        )}
      </div>
      {/* Team Information Section */}
      {isTeamEvent && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#003366]">Team Information</h3>
            <p className="text-sm text-gray-600">
              Maximum team size: {maxTeamSize} members (including you)
              {minTeamSize > 1 && 
                `, minimum ${minTeamSize} members`}
            </p>

            <div className="grid gap-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                required
                className="bg-[#e0f2fe] text-[#003366]"
                placeholder="Enter your team name"
              />
              {errors.team_name && (
                <p className="text-sm text-red-500">{errors.team_name}</p>
              )}
            </div>

            <div className="mt-4">
              <Label className="text-[#003366]">Team Members</Label>
              <p className="text-sm text-gray-600 mb-2">
                {formData.teamMembers.length === 0 
                  ? "You are currently the only team member."
                  : "You and your team members:"}
              </p>

              {/* Current user displayed first */}
              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md border border-blue-200 mb-3">
                <User className="h-4 w-4 text-blue-500" />
                <div className="flex-grow">
                  <div className="font-medium text-[#003366]">{currentUser.name} (You)</div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                </div>
              </div>

              {formData.teamMembers.length > 0 && (
                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-md border">
                      <div className="flex-grow">
                        <div className="font-medium text-[#003366]">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveTeamMember(index)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.member_ids && (
                <p className="text-sm text-red-500 mt-2">{errors.member_ids}</p>
              )}

              {/* Display team size info */}
              <div className="mt-2 text-sm">
                <span className={
                  formData.teamMembers.length + 1 > maxTeamSize 
                    ? "text-red-500" 
                    : minTeamSize > 1 && formData.teamMembers.length + 1 < minTeamSize
                    ? "text-amber-500"
                    : "text-green-600"
                }>
                  Current team size: {formData.teamMembers.length + 1} / {maxTeamSize} members
                </span>
              </div>

              {/* Team member search - only show if not at max capacity */}
              {/* Team member search - only show if not at max capacity */}
{formData.teamMembers.length < maxTeamSize - 1 && (
  <div className="mt-4">
    <div className="relative flex">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <Input
        placeholder="Search for team members by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 bg-[#e0f2fe] text-[#003366] flex-grow"
      />
      <Button 
        type="button"
        onClick={() => handleSearchUser(searchQuery)}
        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Search
      </Button>
    </div>

    {/* Loading indicator */}
    {isSearching && (
      <div className="flex justify-center p-2 mt-1">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )}

    {/* Search results */}
    {searchResults.length > 0 && !isSearching && (
      <div className="mt-1 border rounded-md shadow-sm overflow-hidden bg-white">
        <ul className="max-h-40 overflow-y-auto">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="p-2 hover:bg-[#d1d5db] cursor-pointer flex justify-between items-center"
              onClick={() => handleAddTeamMember(user)}
            >
              <div>
                <div className="font-medium text-[#003366]">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <Plus className="h-4 w-4 text-blue-500" />
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* No results message */}
    {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
      <div className="mt-1 border rounded-md p-2 text-sm text-gray-500 bg-white">
        No users found with that name or email. Users must be registered in the system to join your team.
      </div>
    )}
  </div>
)}
            </div>
          </div>
        </>
      )}

      {/* Payment Section - Only show if event has a registration fee */}
      {!event?.isFree && event?.registration_fee > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#003366]">Payment Information</h3>
            <p className="text-sm text-gray-600">Registration fee: ${event.registration_fee}</p>

            <RadioGroup
              defaultValue="online"
              name="paymentMethod"
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              className="mt-3"
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Pay at Registration Desk</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={isRegistering || !isTeamValid()} 
          className={`${
            isTeamValid() 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gray-400 cursor-not-allowed"
          } text-white font-medium px-4 py-2 rounded-md`}
        >
          {isRegistering ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Registering...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  )
}
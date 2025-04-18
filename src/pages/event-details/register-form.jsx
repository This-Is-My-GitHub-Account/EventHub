"use client"

import { useState } from "react"
import { X, User, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registrationApi, authApi } from "../../lib/api"// Adjust path as needed
import { Toaster } from "@/components/ui/sonner" // Assuming you have a toast component

export default function RegisterForm({ event, onSuccess }) {
  const [formData, setFormData] = useState({
    participantName: "",
    participantEmail: "",
    participantPhone: "",
    paymentMethod: "online",
    teamName: event?.teamEvent ? "" : null,
    teamMembers: event?.teamEvent ? [{ name: "", email: "" }] : null,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [errors, setErrors] = useState({})

  const mockUsers = [
    { id: 1, name: "Jane Smith", email: "jane.smith@college.edu" },
    { id: 2, name: "John Doe", email: "john.doe@college.edu" },
    { id: 3, name: "Alice Johnson", email: "alice.j@college.edu" },
  ]

  const handleSearchUser = (query) => {
    setSearchQuery(query)
    if (query.length > 2) {
      const results = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
      setIsSearching(true)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const handleAddTeamMember = (user) => {
    const newMember = { name: user.name, email: user.email }
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, newMember],
    })
    setSearchQuery("")
    setIsSearching(false)
  }

  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...formData.teamMembers]
    updatedMembers.splice(index, 1)
    setFormData({
      ...formData,
      teamMembers: updatedMembers,
    })
  }

  const handleAddEmptyTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", email: "" }],
    })
  }

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
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
  }

  // Function to get user IDs from emails
  const getUserIdsByEmails = async (emails) => {
    try {
      // Collect all member IDs
      const memberIds = []
      
      for (const email of emails) {
        // Call the getCurrentUserByMail API with the email
        const response = await authApi.getCurrentUserByMail(email)
        
        if (response.data && response.data.id) {
          memberIds.push(response.data.id)
        } else {
          throw new Error(`User with email ${email} not found`)
        }
      }
      
      return memberIds
    } catch (error) {
      console.error("Error fetching user IDs:", error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setErrors({})
    
    try {
      // Prepare the emails array from team members
      const memberEmails = event?.teamEvent 
        ? formData.teamMembers.map(member => member.email)
        : []
      
      // Include the participant's email
      if (!memberEmails.includes(formData.participantEmail)) {
        memberEmails.push(formData.participantEmail)
      }
      
      // Get user IDs from emails
      const memberIds = await getUserIdsByEmails(memberEmails)
      
      // Prepare data according to the schema
      const registrationData = {
        event_id: event.id,
        team_name: formData.teamName,
        member_ids: memberIds,
        payment_method: formData.paymentMethod,
        participant_phone: formData.participantPhone
      }
      
      // Submit the registration
      const response = await registrationApi.register(registrationData)
      
      console.log("Registration successful:", response.data)
      
      // Call the onSuccess callback provided by the parent component
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      // Show success toast
      Toaster({
        title: "Registration Complete",
        description: "You have successfully registered for this event.",
        variant: "success",
      })
      
    } catch (error) {
      console.error("Registration error:", error)
      
      // Set appropriate error message
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || { general: error.response.data.message })
      } else {
        setErrors({ general: "An error occurred during registration. Please try again." })
      }
      
      // Show error toast
      Toaster({
        title: "Registration Failed",
        description: error.response?.data?.message || "Failed to complete registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const isTeamValid = () => {
    if (!event.teamEvent) return true
    if (!formData.teamName) return false
    if (formData.teamMembers.length < event.teamSize.min) return false
    if (formData.teamMembers.length > event.teamSize.max) return false
    return formData.teamMembers.every((member) => member.name && member.email)
  }

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
      
      <div className="space-y-4">
        {/* Personal Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-[#003366]">Your Information</h3>

          <div className="grid gap-2">
            <Label htmlFor="participantName">Full Name</Label>
            <Input
              id="participantName"
              name="participantName"
              value={formData.participantName}
              onChange={handleInputChange}
              required
              className="bg-[#e0f2fe] text-[#003366]"
            />
            {errors.participantName && (
              <p className="text-sm text-red-500">{errors.participantName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="participantEmail">Email</Label>
            <Input
              id="participantEmail"
              name="participantEmail"
              type="email"
              value={formData.participantEmail}
              onChange={handleInputChange}
              required
              className="bg-[#e0f2fe] text-[#003366]"
            />
            {errors.participantEmail && (
              <p className="text-sm text-red-500">{errors.participantEmail}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="participantPhone">Phone Number</Label>
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
        </div>

        {/* Team Info */}
        {event?.teamEvent && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#003366]">Team Information</h3>
              <p className="text-sm text-gray-600">
                Required team size: {event.teamSize.min}-{event.teamSize.max} members
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
                />
                {errors.team_name && (
                  <p className="text-sm text-red-500">{errors.team_name}</p>
                )}
              </div>

              <div className="mt-4">
                <Label className="text-[#003366]">Team Members</Label>
                <p className="text-sm text-gray-600 mb-2">You are automatically included as a team member</p>

                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                          required
                          className="bg-[#e0f2fe] text-[#003366]"
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                          required
                          className="bg-[#e0f2fe] text-[#003366]"
                        />
                      </div>
                      {index > 0 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(index)}>
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.member_ids && (
                  <p className="text-sm text-red-500 mt-2">{errors.member_ids}</p>
                )}

                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search for team members..."
                      value={searchQuery}
                      onChange={(e) => handleSearchUser(e.target.value)}
                      className="pl-9 bg-[#e0f2fe] text-[#003366]"
                    />
                  </div>

                  {isSearching && searchResults.length > 0 && (
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
                            <Plus className="h-4 w-4 text-gray-500" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isSearching && searchResults.length === 0 && (
                    <div className="mt-1 border rounded-md p-2 text-sm text-gray-500 bg-white">No users found</div>
                  )}
                </div>

                {formData.teamMembers.length < event.teamSize.max && (
                  <Button type="button" variant="outline" className="mt-3 w-full" onClick={handleAddEmptyTeamMember}>
                    <User className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Payment */}
        {!event?.isFree && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#003366]">Payment Information</h3>
              <p className="text-sm text-gray-600">Registration fee: {event.registrationFee}</p>

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
              {errors.payment_method && (
                <p className="text-sm text-red-500">{errors.payment_method}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={isRegistering || !isTeamValid()}>
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
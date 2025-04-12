"use client"

import { useState } from "react"
import { User, Camera, Pencil, Mail, Phone, Calendar, Building, Cake, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfileSection() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    gender: "Male",
    stream: "Computer Engineering",
    date_of_birth: "2000-05-15",
    passing_out_year: "2024",
    phoneNumber: "9876543210",
    address: null,
    profilePicture: null,
    bio: "Computer Engineering student passionate about web development and AI."
  })

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    date_of_birth: user.date_of_birth || "",
    gender: user.gender || "",
    stream: user.stream || "",
    passing_out_year: user.passing_out_year || "",
    address: user.address || "",
    bio: user.bio || ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }


  const handleUpdateProfile = async () => {
    try {
      const response = await authApi.updateProfile(formData);
      if (response && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const totalFields = Object.keys(user).length
    let filledFields = 0
    
    for (const key in user) {
      if (user[key] !== null && user[key] !== "") {
        filledFields++
      }
    }
    
    return Math.round((filledFields / totalFields) * 100)
  }

  const completionPercentage = calculateProfileCompletion()

  return (
    <div className="bg-white rounded-lg border border-[#d5efe6] shadow-sm">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#d5efe6]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#d5efe6] flex items-center justify-center">
                <User className="h-12 w-12 text-[#2c7873]" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-[#2c7873] text-white p-1.5 rounded-full shadow-md hover:bg-[#1c5853] transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-[#2c7873]" /> 
                  {user.email}
                </p>
                {user.bio && (
                  <p className="text-gray-600 mt-2 text-sm italic">"{user.bio}"</p>
                )}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6]"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </SheetTrigger>
                <SheetContent className="!w-[500px] sm:!w-[500px] max-w-full">
                  <SheetHeader>
                    <SheetTitle className="text-[#2c7873]">Edit Profile</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="stream">Department</Label>
                      <Select
                        value={formData.stream}
                        onValueChange={(value) => handleSelectChange("stream", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="passing_out_year">Passing Out Year</Label>
                      <Select
                        value={formData.passing_out_year}
                        onValueChange={(value) => handleSelectChange("passing_out_year", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 ml-4 mr-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <Button 
                      className="w-full mt-6 bg-[#2c7873] hover:bg-[#1c5853] text-white"
                      onClick={handleUpdateProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#2c7873]" />
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{user.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#2c7873]" />
                <span className="text-gray-600">Passing Year:</span>
                <span className="font-medium">{user.passing_out_year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cake className="h-4 w-4 text-[#2c7873]" />
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{new Date(user.date_of_birth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-[#2c7873]" />
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{user.gender}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-[#d5efe6]" />

        {/* Profile Completion Section */}
        <div className="bg-[#d5efe6] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-[#2c7873]">Profile Completion</h3>
            <span className="text-[#2c7873] font-semibold">{completionPercentage}%</span>
          </div>
          
          <div className="w-full bg-white rounded-full h-2 mb-3">
            <div
              className="bg-[#2c7873] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          {completionPercentage < 100 && (
            <div className="text-sm text-gray-600 flex items-center">
              <Pencil className="h-4 w-4 mr-1 text-[#2c7873]" />
              <span>Complete your profile to unlock more features</span>
            </div>
          )}
          
          {completionPercentage === 100 && (
            <div className="text-sm text-[#2c7873] flex items-center font-medium">
              <UserCheck className="h-4 w-4 mr-1" />
              <span>Your profile is complete!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
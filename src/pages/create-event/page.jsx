"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Upload, MinusCircle, PlusCircle } from "lucide-react"
import { eventsApi } from "../../lib/api";

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [eventImage, setEventImage] = useState(null)
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    rules: "",
    department: "",
    venue: "",
    start_date: "",
    end_date: "",
    event_time: "",
    category: "Technical",
    registration_fee: 0,
    isFree: true,
    participation_type: "Solo",
    min_team_size: 1,
    max_team_size: 1,
    max_participants: 100,
    prizes: {
      first: "",
      second: "",
      third: ""
    },
    organizer: "",
    contact_info: "",
    registration_deadline: "",
    event_type: "In Person",
    timeline: [{ time: "", event: "" }],
  })

  // Theme colors
  const themeColors = {
    primary: "#2c7873",
    primaryLight: "#e0f2fe",
    text: "#000000",
    background: "#ffffff",
  }

  // Department options
  const departments = [
    { value: "Computer Engineering", label: "Computer Engineering" },
    { value: "Electronics & Telecommunication", label: "Electronics & Telecommunication" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "All Departments", label: "All Departments" },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === "isFree") {
      setFormData({
        ...formData,
        isFree: checked,
        registration_fee: checked ? 0 : formData.registration_fee
      })
      return
    }
    
    if (name === "participation_type") {
      const isTeam = value === "Team"
      setFormData({
        ...formData,
        participation_type: value,
        min_team_size: isTeam ? 2 : 1,
        max_team_size: isTeam ? 4 : 1
      })
      return
    }
    
    if (name === "category") {
      setFormData({
        ...formData,
        category: value
      })
      return
    }
    
    if (name.startsWith("prize_")) {
      const prizeKey = name.replace("prize_", "")
      setFormData({
        ...formData,
        prizes: {
          ...formData.prizes,
          [prizeKey]: value
        }
      })
      return
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name, value) => {
    if (name === "participation_type") {
      const isTeam = value === "Team"
      setFormData({
        ...formData,
        participation_type: value,
        min_team_size: isTeam ? 2 : 1,
        max_team_size: isTeam ? 4 : 1
      })
      return
    }
    
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEventImage(file)
    }
  }

  const handleTimelineChange = (index, field, value) => {
    const updatedTimeline = [...formData.timeline]
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: value }
    setFormData({
      ...formData,
      timeline: updatedTimeline,
    })
  }

  const addTimelineItem = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { time: "", event: "" }],
    })
  }

  const removeTimelineItem = (index) => {
    if (formData.timeline.length > 1) {
      const updatedTimeline = [...formData.timeline]
      updatedTimeline.splice(index, 1)
      setFormData({
        ...formData,
        timeline: updatedTimeline,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (formData.participation_type === "Team" && formData.min_team_size > formData.max_team_size) {
        throw new Error("Minimum team size cannot be greater than maximum team size");
      }

      if (!formData.isFree && !formData.registration_fee) {
        throw new Error("Please enter a registration fee for paid events");
      }
      
      if (!formData.registration_deadline) {
        throw new Error("Registration deadline is required");
      }

      // Create FormData object for file upload
      const submitData = new FormData();
      
      // Prepare the important dates object
      const important_dates = {
        start_date: formData.start_date,
        end_date: formData.end_date || formData.start_date,
      };
      
      // Structure the event data for backend
      const eventData = {
        event_name: formData.event_name,
        event_description: formData.event_description,
        rules: formData.rules,
        department: formData.department,
        venue: formData.venue,
        important_dates: important_dates,
        category: formData.category,
        registration_fee: formData.isFree ? 0 : Number(formData.registration_fee),
        participation_type: formData.participation_type,
        max_team_size: Number(formData.max_team_size),
        max_participants: Number(formData.max_participants),
        prizes: formData.prizes,
        organizer: formData.organizer,
        contact_info: formData.contact_info,
        registration_deadline: formData.registration_deadline,
        event_type: formData.event_type
      };

      // Append event data
      if (eventImage) {
        submitData.append('file', eventImage);
        // Add event data as a separate field
        submitData.append('eventData', JSON.stringify(eventData));

        
        // Call the API to create the event
        console.log(eventData);
        console.log(submitData);
        const response = await eventsApi.create(submitData);
        console.log("Event created successfully:", response.data);
      } else {
        // No image, just send the event data directly
        const response = await eventsApi.create(eventData);
        console.log("Event created successfully:", response.data);
      }
      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.message || err.message || "An error occurred while creating the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTabValid = (tab) => {
    switch (tab) {
      case "details":
        return (
          formData.event_name &&
          formData.event_description &&
          formData.department &&
          formData.venue &&
          formData.start_date
        )
      case "registration":
        return (
          (formData.participation_type !== "Team" || 
            (Number(formData.min_team_size) <= Number(formData.max_team_size))) &&
          formData.max_participants &&
          formData.registration_deadline &&
          (formData.isFree || formData.registration_fee)
        )
      case "additional":
        // All fields in this tab are optional
        return true
      default:
        return false
    }
  }

  const nextTab = () => {
    if (activeTab === "details" && isTabValid("details")) {
      setActiveTab("registration")
    } else if (activeTab === "registration" && isTabValid("registration")) {
      setActiveTab("additional")
    }
  }

  const prevTab = () => {
    if (activeTab === "registration") {
      setActiveTab("details")
    } else if (activeTab === "additional") {
      setActiveTab("registration")
    }
  }

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#2c7873]">Create a New Event</h1>
              <p className="text-black mt-2">Fill in the details below to create your event</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 border-red-500 bg-red-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8">
                <TabsList className="grid w-full grid-cols-3 bg-[#e0f2fe]">
                  <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-[#2c7873] data-[state=active]:text-white"
                  >
                    Event Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="registration" 
                    className="data-[state=active]:bg-[#2c7873] data-[state=active]:text-white"
                  >
                    Registration Settings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="additional" 
                    className="data-[state=active]:bg-[#2c7873] data-[state=active]:text-white"
                  >
                    Additional Information
                  </TabsTrigger>
                </TabsList>
              </div>

              <form onSubmit={handleSubmit}>
                <Card className="bg-white shadow-md rounded-xl border-t-4 border-[#2c7873]">
                  <CardContent className="pt-6">
                    {/* EVENT DETAILS TAB */}
                    <TabsContent value="details">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="event_name" className="text-[#2c7873] font-medium">Event Title</Label>
                          <Input 
                            id="event_name" 
                            name="event_name" 
                            value={formData.event_name} 
                            onChange={handleChange} 
                            className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="event_description" className="text-[#2c7873] font-medium">Event Description</Label>
                          <Textarea
                            id="event_description"
                            name="event_description"
                            value={formData.event_description}
                            onChange={handleChange}
                            className="focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                            rows={5}
                            required
                          />
                          <p className="text-xs text-gray-600">
                            Describe your event in detail. You can include HTML formatting.
                          </p>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="space-y-2">
                          <Label htmlFor="eventImage" className="text-[#2c7873] font-medium">Event Image</Label>
                          <div className="border rounded-md p-4 border-dashed border-[#2c7873] bg-[#e0f2fe] bg-opacity-20">
                            <div className="flex items-center justify-center">
                              {eventImage ? (
                                <div className="relative">
                                  <img
                                    src={URL.createObjectURL(eventImage)}
                                    alt="Event preview"
                                    className="w-full h-48 object-cover rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="absolute bottom-2 right-2 bg-white hover:bg-[#e0f2fe] text-[#2c7873] border-[#2c7873]"
                                    onClick={() => setEventImage(null)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-12 w-12 text-[#2c7873]" />
                                  <div className="mt-2">
                                    <Button type="button" variant="outline" asChild className="border-[#2c7873] text-[#2c7873] hover:bg-[#e0f2fe]">
                                      <label htmlFor="file-upload" className="cursor-pointer">
                                        Upload image
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          accept="image/*"
                                          onChange={handleImageChange}
                                          className="sr-only"
                                        />
                                      </label>
                                    </Button>
                                  </div>
                                  <p className="mt-2 text-xs text-gray-600">
                                    Recommended size: 800x400 pixels. PNG, JPG or GIF.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* DEPT + LOCATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="department" className="text-[#2c7873] font-medium">Department</Label>
                            <Select
                              value={formData.department}
                              onValueChange={(value) => handleSelectChange("department", value)}
                              required
                            >
                              <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.value} value={dept.value}>
                                    {dept.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="venue" className="text-[#2c7873] font-medium">Event Location</Label>
                            <Input
                              id="venue"
                              name="venue"
                              value={formData.venue}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                              required
                            />
                          </div>
                        </div>

                        {/* DATE + TIME */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 relative">
                            <Label htmlFor="start_date" className="text-[#2c7873] font-medium">Start Date</Label>
                            <CalendarIcon className="absolute left-3 top-9 text-[#2c7873]" size={16} />
                            <Input
                              id="start_date"
                              name="start_date"
                              type="date"
                              min={getTodayDate()}
                              value={formData.start_date}
                              onChange={handleChange}
                              className="pl-10 focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                              required
                            />
                          </div>

                          <div className="space-y-2 relative">
                            <Label htmlFor="end_date" className="text-[#2c7873] font-medium">End Date</Label>
                            <CalendarIcon className="absolute left-3 top-9 text-[#2c7873]" size={16} />
                            <Input
                              id="end_date"
                              name="end_date"
                              type="date"
                              min={formData.start_date || getTodayDate()}
                              value={formData.end_date}
                              onChange={handleChange}
                              className="pl-10 focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                            />
                            <p className="text-xs text-gray-600">Leave empty if it's a single-day event</p>
                          </div>
                        </div>

                        {/* EVENT TYPE */}
                        <div className="space-y-2">
                          <Label htmlFor="event_type" className="text-[#2c7873] font-medium">Event Type</Label>
                          <Select
                            value={formData.event_type}
                            onValueChange={(value) => handleSelectChange("event_type", value)}
                            required
                          >
                            <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Person">In Person</SelectItem>
                              <SelectItem value="Online">Virtual</SelectItem>
                              
                            </SelectContent>
                          </Select>
                        </div>

                        {/* TECHNICAL/NON-TECHNICAL */}
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-[#2c7873] font-medium">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange("category", value)}
                            required
                          >
                            <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technical">Technical</SelectItem>
                              <SelectItem value="Non-Technical">Non-Technical</SelectItem>
                              <SelectItem value="Cultural">Cultural</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end mt-6">
                          <Button 
                            type="button" 
                            className="bg-[#2c7873] hover:bg-[#002a52] text-white" 
                            onClick={nextTab}
                          >
                            Next: Registration Settings
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* REGISTRATION SETTINGS */}
                    <TabsContent value="registration">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 py-2 bg-[#e0f2fe] bg-opacity-30 p-3 rounded-md border border-[#e0f2fe]">
                          <Checkbox
                            id="isFree"
                            name="isFree"
                            checked={formData.isFree}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                isFree: checked,
                                registration_fee: checked ? 0 : formData.registration_fee,
                              })
                            }
                            className="data-[state=checked]:bg-[#2c7873] data-[state=checked]:border-[#2c7873]"
                          />
                          <Label htmlFor="isFree" className="text-black">This is a free event</Label>
                        </div>

                        {!formData.isFree && (
                          <div className="space-y-2">
                            <Label htmlFor="registration_fee" className="text-[#2c7873] font-medium">Registration Fee (₹)</Label>
                            <Input
                              id="registration_fee"
                              name="registration_fee"
                              type="number"
                              value={formData.registration_fee}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                              required={!formData.isFree}
                            />
                          </div>
                        )}

                        {/* PARTICIPATION TYPE */}
                        <div className="space-y-2">
                          <Label htmlFor="participation_type" className="text-[#2c7873] font-medium">Participation Type</Label>
                          <Select
                            value={formData.participation_type}
                            onValueChange={(value) => handleSelectChange("participation_type", value)}
                            required
                          >
                            <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                              <SelectValue placeholder="Select participation type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Solo">Individual</SelectItem>
                              <SelectItem value="Team">Team</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.participation_type === "Team" && (
                          <div className="grid grid-cols-2 gap-4 bg-[#e0f2fe] bg-opacity-20 p-4 rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="min_team_size" className="text-[#2c7873] font-medium">Minimum Team Size</Label>
                              <Select
                                value={formData.min_team_size.toString()}
                                onValueChange={(value) => handleSelectChange("min_team_size", Number(value))}
                              >
                                <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                                  <SelectValue placeholder="Min size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[2, 3, 4, 5].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="max_team_size" className="text-[#2c7873] font-medium">Maximum Team Size</Label>
                              <Select
                                value={formData.max_team_size.toString()}
                                onValueChange={(value) => handleSelectChange("max_team_size", Number(value))}
                              >
                                <SelectTrigger className="focus:ring-[#2c7873] border-[#e0f2fe]">
                                  <SelectValue placeholder="Max size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[2, 3, 4, 5, 6, 7, 8, 10].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="max_participants" className="text-[#2c7873] font-medium">Maximum Participants</Label>
                          <Input
                            id="max_participants"
                            name="max_participants"
                            type="number"
                            value={formData.max_participants}
                            onChange={handleChange}
                            className="focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                            required
                          />
                        </div>

                        <div className="space-y-2 relative">
                          <Label htmlFor="registration_deadline" className="text-[#2c7873] font-medium">Registration Deadline</Label>
                          <CalendarIcon className="absolute left-3 top-9 text-[#2c7873]" size={16} />
                          <Input
                            id="registration_deadline"
                            name="registration_deadline"
                            type="date"
                            min={getTodayDate()}
                            max={formData.start_date || ""}
                            value={formData.registration_deadline}
                            onChange={handleChange}
                            className="pl-10 focus-visible:ring-[#2c7873] border-[#e0f2fe]"
                            required
                          />
                          <p className="text-xs text-gray-600">
                            Must be before or on the event start date
                          </p>
                        </div>

                        <div className="flex justify-between mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevTab}
                            className="border-[#2c7873] text-[#2c7873] hover:bg-[#e0f2fe]"
                          >
                            Back
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-[#2c7873] hover:bg-[#002a52] text-white" 
                            onClick={nextTab}
                          >
                            Next: Additional Info
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* ADDITIONAL TAB */}
                    <TabsContent value="additional">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rules" className="text-[#2c7873] font-medium">Rules & Guidelines</Label>
                          <Textarea 
                            id="rules" 
                            name="rules" 
                            value={formData.rules} 
                            onChange={handleChange} 
                            rows={4}
                            className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                          />
                          <p className="text-xs text-gray-600">You can include HTML formatting.</p>
                        </div>

                        {/* PRIZES SECTION */}
                        <div className="space-y-4 bg-[#e0f2fe] bg-opacity-20 p-4 rounded-md">
                          <Label className="text-[#2c7873] font-medium">Prizes</Label>
                          
                          <div className="space-y-2">
                            <Label htmlFor="prize_first" className="text-gray-600 text-sm">First Prize (₹)</Label>
                            <Input 
                              id="prize_first" 
                              name="prize_first" 
                              value={formData.prizes.first} 
                              onChange={handleChange}
                              placeholder="e.g. 5000"
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="prize_second" className="text-gray-600 text-sm">Second Prize (₹)</Label>
                            <Input 
                              id="prize_second" 
                              name="prize_second" 
                              value={formData.prizes.second} 
                              onChange={handleChange}
                              placeholder="e.g. 3000"
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="prize_third" className="text-gray-600 text-sm">Third Prize (₹)</Label>
                            <Input 
                              id="prize_third" 
                              name="prize_third" 
                              value={formData.prizes.third} 
                              onChange={handleChange}
                              placeholder="e.g. 2000"
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="organizer" className="text-[#2c7873] font-medium">Organizer Name</Label>
                            <Input 
                              id="organizer" 
                              name="organizer" 
                              value={formData.organizer} 
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contact_info" className="text-[#2c7873] font-medium">Contact Information</Label>
                            <Input 
                              id="contact_info" 
                              name="contact_info" 
                              value={formData.contact_info} 
                              onChange={handleChange}
                              placeholder="Email or phone number"
                              className="focus-visible:ring-[#2c7873] border-[#e0f2fe]" 
                            />
                          </div>
                        </div>
                        
                        
                        
                        <div className="flex justify-between mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevTab}
                            className="border-[#2c7873] text-[#2c7873] hover:bg-[#e0f2fe]"
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-[#2c7873] hover:bg-[#002a52] text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Creating Event..." : "Create Event"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </form>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
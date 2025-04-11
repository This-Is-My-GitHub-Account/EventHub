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

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [eventImage, setEventImage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: "",
    department: "",
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    isTechnical: true,
    isFree: false,
    registrationFee: "",
    teamEvent: false,
    minTeamSize: "1",
    maxTeamSize: "1",
    maxRegistrations: "",
    prize: "",
    organizer: "",
    contact: "",
    timeline: [{ time: "", event: "" }],
  })

  // Theme colors
  const themeColors = {
    primary: "#2c7873",
    primaryLight: "#d5efe6",
    text: "#000000",
    background: "#ffffff",
  }

  // Department options
  const departments = [
    { value: "computer", label: "Computer Engineering" },
    { value: "electronics", label: "Electronics & Telecommunication" },
    { value: "civil", label: "Civil Engineering" },
    { value: "mechanical", label: "Mechanical Engineering" },
    { value: "electrical", label: "Electrical Engineering" },
    { value: "it", label: "Information Technology" },
    { value: "all", label: "All Departments" },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // If changing from team to individual event, reset team sizes
    if (name === "teamEvent" && !checked) {
      setFormData({
        ...formData,
        teamEvent: false,
        minTeamSize: "1",
        maxTeamSize: "1",
      })
    }

    // If changing from free to paid, clear registration fee
    if (name === "isFree") {
      if (checked) {
        setFormData({
          ...formData,
          isFree: true,
          registrationFee: "",
        })
      } else {
        setFormData({
          ...formData,
          isFree: false,
        })
      }
    }
  }

  const handleSelectChange = (name, value) => {
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
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form data
      if (formData.teamEvent && Number.parseInt(formData.minTeamSize) > Number.parseInt(formData.maxTeamSize)) {
        throw new Error("Minimum team size cannot be greater than maximum team size")
      }

      if (!formData.isFree && !formData.registrationFee) {
        throw new Error("Please enter a registration fee for paid events")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard on success
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "An error occurred while creating the event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isTabValid = (tab) => {
    switch (tab) {
      case "details":
        return (
          formData.title &&
          formData.description &&
          formData.department &&
          formData.location &&
          formData.eventDate &&
          formData.startTime &&
          formData.endTime
        )
      case "registration":
        return (
          (!formData.teamEvent || Number.parseInt(formData.minTeamSize) <= Number.parseInt(formData.maxTeamSize)) &&
          formData.maxRegistrations &&
          (formData.isFree || formData.registrationFee)
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
                <TabsList className="grid w-full grid-cols-3 bg-[#d5efe6]">
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
                          <Label htmlFor="title" className="text-[#2c7873] font-medium">Event Title</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="focus-visible:ring-[#2c7873] border-[#d5efe6]" 
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-[#2c7873] font-medium">Event Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
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
                          <div className="border rounded-md p-4 border-dashed border-[#2c7873] bg-[#d5efe6] bg-opacity-20">
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
                                    className="absolute bottom-2 right-2 bg-white hover:bg-[#d5efe6] text-[#2c7873] border-[#2c7873]"
                                    onClick={() => setEventImage(null)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-12 w-12 text-[#2c7873]" />
                                  <div className="mt-2">
                                    <Button type="button" variant="outline" asChild className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6]">
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
                              <SelectTrigger className="focus:ring-[#2c7873] border-[#d5efe6]">
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
                            <Label htmlFor="location" className="text-[#2c7873] font-medium">Event Location</Label>
                            <Input
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              required
                            />
                          </div>
                        </div>

                        {/* DATE + TIME */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 relative">
                            <Label htmlFor="eventDate" className="text-[#2c7873] font-medium">Event Date</Label>
                            <CalendarIcon className="absolute left-3 top-9 text-[#2c7873]" size={16} />
                            <Input
                              id="eventDate"
                              name="eventDate"
                              type="date"
                              value={formData.eventDate}
                              onChange={handleChange}
                              className="pl-10 focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="startTime" className="text-[#2c7873] font-medium">Start Time</Label>
                            <Input
                              id="startTime"
                              name="startTime"
                              type="time"
                              value={formData.startTime}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endTime" className="text-[#2c7873] font-medium">End Time</Label>
                            <Input
                              id="endTime"
                              name="endTime"
                              type="time"
                              value={formData.endTime}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              required
                            />
                          </div>
                        </div>

                        {/* TECHNICAL CHECKBOX */}
                        <div className="flex items-center space-x-2 bg-[#d5efe6] bg-opacity-30 p-3 rounded-md border border-[#d5efe6]">
                          <Checkbox
                            id="isTechnical"
                            name="isTechnical"
                            checked={formData.isTechnical}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isTechnical: checked })
                            }
                            className="data-[state=checked]:bg-[#2c7873] data-[state=checked]:border-[#2c7873]"
                          />
                          <Label htmlFor="isTechnical" className="text-black">This is a technical event</Label>
                        </div>

                        <div className="flex justify-end mt-6">
                          <Button 
                            type="button" 
                            className="bg-[#2c7873] hover:bg-[#1a5652] text-white" 
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
                        <div className="flex items-center space-x-2 py-2 bg-[#d5efe6] bg-opacity-30 p-3 rounded-md border border-[#d5efe6]">
                          <Checkbox
                            id="isFree"
                            name="isFree"
                            checked={formData.isFree}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                isFree: checked,
                                registrationFee: checked ? "" : formData.registrationFee,
                              })
                            }
                            className="data-[state=checked]:bg-[#2c7873] data-[state=checked]:border-[#2c7873]"
                          />
                          <Label htmlFor="isFree" className="text-black">This is a free event</Label>
                        </div>

                        {!formData.isFree && (
                          <div className="space-y-2">
                            <Label htmlFor="registrationFee" className="text-[#2c7873] font-medium">Registration Fee (₹)</Label>
                            <Input
                              id="registrationFee"
                              name="registrationFee"
                              type="number"
                              value={formData.registrationFee}
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              required
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2 py-2 bg-[#d5efe6] bg-opacity-30 p-3 rounded-md border border-[#d5efe6]">
                          <Checkbox
                            id="teamEvent"
                            name="teamEvent"
                            checked={formData.teamEvent}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                teamEvent: checked,
                                minTeamSize: checked ? "2" : "1",
                                maxTeamSize: checked ? "4" : "1",
                              })
                            }
                            className="data-[state=checked]:bg-[#2c7873] data-[state=checked]:border-[#2c7873]"
                          />
                          <Label htmlFor="teamEvent" className="text-black">This is a team event</Label>
                        </div>

                        {formData.teamEvent && (
                          <div className="grid grid-cols-2 gap-4 bg-[#d5efe6] bg-opacity-20 p-4 rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="minTeamSize" className="text-[#2c7873] font-medium">Minimum Team Size</Label>
                              <Select
                                value={formData.minTeamSize}
                                onValueChange={(value) => handleSelectChange("minTeamSize", value)}
                              >
                                <SelectTrigger className="focus:ring-[#2c7873] border-[#d5efe6]">
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
                              <Label htmlFor="maxTeamSize" className="text-[#2c7873] font-medium">Maximum Team Size</Label>
                              <Select
                                value={formData.maxTeamSize}
                                onValueChange={(value) => handleSelectChange("maxTeamSize", value)}
                              >
                                <SelectTrigger className="focus:ring-[#2c7873] border-[#d5efe6]">
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
                          <Label htmlFor="maxRegistrations" className="text-[#2c7873] font-medium">Maximum Registrations</Label>
                          <Input
                            id="maxRegistrations"
                            name="maxRegistrations"
                            type="number"
                            value={formData.maxRegistrations}
                            onChange={handleChange}
                            className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                            required
                          />
                        </div>

                        <div className="flex justify-between mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevTab}
                            className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6]"
                          >
                            Back
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-[#2c7873] hover:bg-[#1a5652] text-white" 
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
                            className="focus-visible:ring-[#2c7873] border-[#d5efe6]" 
                          />
                          <p className="text-xs text-gray-600">You can include HTML formatting.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="prize" className="text-[#2c7873] font-medium">Prize</Label>
                            <Input 
                              id="prize" 
                              name="prize" 
                              value={formData.prize} 
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]" 
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="organizer" className="text-[#2c7873] font-medium">Organizer/Club</Label>
                            <Input 
                              id="organizer" 
                              name="organizer" 
                              value={formData.organizer} 
                              onChange={handleChange}
                              className="focus-visible:ring-[#2c7873] border-[#d5efe6]" 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact" className="text-[#2c7873] font-medium">Contact Email</Label>
                          <Input 
                            id="contact" 
                            name="contact" 
                            type="email" 
                            value={formData.contact} 
                            onChange={handleChange}
                            className="focus-visible:ring-[#2c7873] border-[#d5efe6]" 
                          />
                        </div>

                        {/* Timeline */}
                        <div className="space-y-2 bg-[#d5efe6] bg-opacity-20 p-4 rounded-md">
                          <Label className="text-[#2c7873] font-medium">Event Timeline</Label>
                          {formData.timeline.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                placeholder="Time"
                                value={item.time}
                                onChange={(e) => handleTimelineChange(index, "time", e.target.value)}
                                className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              />
                              <Input
                                placeholder="Event description"
                                value={item.event}
                                onChange={(e) => handleTimelineChange(index, "event", e.target.value)}
                                className="focus-visible:ring-[#2c7873] border-[#d5efe6]"
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeTimelineItem(index)} 
                                disabled={formData.timeline.length <= 1}
                                className="text-[#2c7873] hover:bg-[#d5efe6]"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addTimelineItem}
                            className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6]"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Timeline Item
                          </Button>
                        </div>

                        <div className="flex justify-between mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevTab}
                            className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6]"
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-[#2c7873] hover:bg-[#1a5652] text-white" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                Creating...
                              </>
                            ) : (
                              "Create Event"
                            )}
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
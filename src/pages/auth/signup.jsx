"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authApi } from "../../lib/api" // Import the authApi from your api.js file

export default function SignUpPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    stream: "",
    date_of_birth: "",
    passing_out_year: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidePosition, setSlidePosition] = useState(0)

  const slides = [
    { image: "/dance.jpg", alt: "College Events" },
    { image: "/sports.jpg", alt: "Students Networking" },
    { image: "/music.png", alt: "Technical Workshops" }
  ]

  useEffect(() => {
    const scrollSpeed = 0.2
    let animationFrameId = null

    const animate = () => {
      setSlidePosition(prevPos => (prevPos >= 50 ? 0 : prevPos + scrollSpeed))
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 10000)
    return () => clearInterval(slideInterval)
  }, [slides.length])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Create data object to match backend schema
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender || undefined,
      stream: formData.stream || undefined,
      date_of_birth: formData.date_of_birth || undefined,
      passing_out_year: formData.passing_out_year ? parseInt(formData.passing_out_year) : undefined
    }

    try {
      const response = await authApi.register(userData)
      
      // Store the token and user data
      const { token, ...user } = response.data
      localStorage.setItem('userToken', token)
      localStorage.setItem('userData', JSON.stringify(user))
      
      // Redirect to dashboard
      navigate("/dashboard")
    } catch (err) {
      // Extract error message from response if available
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message ||
                          "An error occurred during registration. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const departments = [
    { value: "computer", label: "Computer Engineering" },
    { value: "electronics", label: "Electronics & Telecommunication" },
    { value: "civil", label: "Civil Engineering" },
    { value: "mechanical", label: "Mechanical Engineering" },
    { value: "electrical", label: "Electrical Engineering" },
    { value: "it", label: "Information Technology" }
  ]

  const currentYear = new Date().getFullYear()
  const passingOutYears = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-black">EventHub</h1>
            </Link>
            <h2 className="text-2xl font-bold mt-6 text-black">Create your account</h2>
            <p className="mt-2 text-gray-600">Join EventHub to discover and participate in exciting events</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={value => handleSelectChange("gender", value)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream">Department</Label>
                <Select value={formData.stream} onValueChange={value => handleSelectChange("stream", value)}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingOutYear">Passing Out Year</Label>
                <Select value={formData.passing_out_year} onValueChange={value => handleSelectChange("passing_out_year", value)}>
                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {passingOutYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" className="h-4 w-4" required />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-[#2c7873] hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#2c7873] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" className="w-full bg-[#2c7873] hover:bg-[#1d5551] text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Creating account...
                </>
              ) : "Sign up"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#2c7873] hover:underline">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Slideshow */}
      <div className="hidden md:block flex-1 relative overflow-hidden bg-[#d5efe6]">
        <div className="h-full relative">
          {slides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute w-full"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200%",
                    transform: `translateY(-${slidePosition}%)`,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Slide indicators */}
          <div className="absolute top-8 right-8 flex flex-col space-y-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Bottom Description */}
          <div className="absolute bottom-8 left-8 max-w-sm bg-black bg-opacity-50 p-4 rounded-lg text-white z-10">
            <h3 className="text-xl font-bold mb-2">Create, Join & Discover Events</h3>
            <p className="text-sm">EventHub is your one-stop platform for all college events. Register now to unlock the full experience!</p>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 h-full w-1 bg-[#2c7873] bg-opacity-20 z-10">
            <div className="bg-white w-full" style={{ height: `${slidePosition * 2}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
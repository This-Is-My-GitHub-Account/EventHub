"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); 
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);

  const redirectTo = location.state?.redirectTo || "/dashboard";

  const slides = [
    {
      image: "/dance.jpg",
      alt: "College Events",
    },
    {
      image: "/sports.jpg",
      alt: "Students Networking",
    },
    {
      image: "/music.png",
      alt: "Technical Workshops",
    },
  ];

  // Smooth continuous scroll
  useEffect(() => {
    const scrollSpeed = 0.2;
    let animationFrameId = null;

    const animate = () => {
      setSlidePosition((prevPos) => (prevPos >= 50 ? 0 : prevPos + scrollSpeed));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto-slide switch every 10s
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the login function from AuthContext
      await login(formData.email, formData.password, formData.rememberMe);
      
      // Navigate to the redirect page after successful login
      navigate(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-black">EventHub</h1>
            </Link>
            <h2 className="text-2xl font-bold mt-6 text-black">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to access your account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-[#d5efe6] focus:border-[#2c7873] focus:ring-[#2c7873]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#2c7873] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-[#d5efe6] focus:border-[#2c7873] focus:ring-[#2c7873]"
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

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#2c7873] focus:ring-[#2c7873]"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2c7873] hover:bg-[#1d5551] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-[#2c7873] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Slideshow - No changes needed here */}
      <div className="hidden md:block flex-1 relative overflow-hidden bg-[#d5efe6]">
        <div className="h-full relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute w-full h-auto"
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

          {/* Indicators */}
          <div className="absolute top-8 right-8 flex flex-col space-y-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white bg-opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Description Box */}
          <div className="absolute bottom-8 left-8 max-w-sm bg-black bg-opacity-50 p-4 rounded-lg text-white z-10">
            <h3 className="text-xl font-bold mb-2">Discover Amazing Events</h3>
            <p className="text-sm">
              Join thousands of students to discover, participate, and create
              exciting events across all departments.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-full w-1 bg-[#2c7873] bg-opacity-20 z-10">
            <div
              className="bg-white w-full"
              style={{ height: `${slidePosition * 2}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
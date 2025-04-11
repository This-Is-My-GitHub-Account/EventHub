import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">EventHub</h3>
            <p className="text-gray-600">
              Discover, create, and participate in exciting events across all departments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-600 hover:text-primary transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Departments</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?department=computer" className="text-gray-600 hover:text-primary transition-colors">
                  Computer Engineering
                </Link>
              </li>
              <li>
                <Link
                  to="/events?department=electronics"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Electronics & Telecommunication
                </Link>
              </li>
              <li>
                <Link to="/events?department=civil" className="text-gray-600 hover:text-primary transition-colors">
                  Civil Engineering
                </Link>
              </li>
              <li>
                <Link to="/events?department=mechanical" className="text-gray-600 hover:text-primary transition-colors">
                  Mechanical Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail size={20} className="text-gray-600 mt-0.5" />
                <span className="text-gray-600">support@eventhub.com</span>
              </div>
              <p className="text-gray-600">
                University Campus,
                <br />
                Engineering College Road,
                <br />
                City, State - 400001
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

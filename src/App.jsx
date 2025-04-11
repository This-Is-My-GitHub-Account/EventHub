import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// Pages
import HomePage from "./pages/home/page";
import EventsPage from "./pages/events/page";
import EventDetailsPage from "./pages/event-details/page";
import DashboardPage from "./pages/dashboard/page";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import CreateEventPage from "./pages/create-event/page";
import RegisterForm from "./pages/event-details/register-form";

// Auth Guard Component
const AuthGuard = ({ children }) => {
  const isAuthenticated = true; // replace with real auth logic

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event-details/:id" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/event-details/register/:id" element={<RegisterForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/create-event"
            element={
              <AuthGuard>
                <CreateEventPage />
              </AuthGuard>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <AuthGuard>
                <CreateEventPage />
              </AuthGuard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;

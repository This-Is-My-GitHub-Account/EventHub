"use client"; // Ensure this component runs on the client-side

import React, { useState, useEffect, useReducer, useRef } from "react";
import { ArrowRight } from "lucide-react"; // Assuming you still want the 'View All Events' button
import { Button } from "@/components/ui/button"; // Assuming Button component path
import { Link, useNavigate } from "react-router-dom"; // Or your routing library
import { eventsApi } from "../../lib/api"; // Import events API

// --- CSS Styles (Adapted from the example) ---
// You can move this to a separate CSS file (e.g., HeroSection.module.css) and import it
// Or use styled-components/Tailwind CSS if preferred.
const styles = `
  .hero-slides-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh; // Adjust height as needed
    width: 100%;
    overflow: hidden; /* Hide overflow for seamless look */
    background: #151515; // Background from example
    padding: 2rem 0; /* Add some padding */
    margin-bottom: 2rem; /* Space below the slider */
  }

  .hero-slides {
    display: grid;
    width: 35vw; /* Adjust width based on desired slide size */
    perspective: 1000px; /* Added perspective here */
  }

  .hero-slides > .slide {
    grid-area: 1 / -1;
    width: 100%;
    height: 45vw; /* Adjust height based on desired slide size */
    // transition: transform 0.5s ease-in-out, opacity 0.3s linear; // Transitions handled by offset/active state
    will-change: transform, opacity;
  }

  .hero-slides > button {
    appearance: none;
    background: transparent;
    border: none;
    color: white;
    position: absolute;
    font-size: 4rem; /* Slightly smaller buttons */
    width: 4rem;
    height: 4rem;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.3s;
    opacity: 0.7;
    z-index: 5;
    cursor: pointer;
  }

  .hero-slides > button:hover {
    opacity: 1;
  }

  .hero-slides > button:focus {
    outline: none;
  }

  /* Positioning buttons relative to the .hero-slides container */
  .hero-slides > button:first-of-type {
     left: -6rem; /* Adjust position */
  }
  .hero-slides > button:last-of-type {
     right: -6rem; /* Adjust position */
  }


  .slideContent {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    transition: transform 0.6s ease-in-out, opacity 0.5s ease-in-out;
    opacity: 0.7;
    display: grid;
    align-content: center; /* Center content vertically */
    justify-content: center; /* Center content horizontally */
    text-align: center; /* Center text */
    transform-style: preserve-3d;
    transform: perspective(1000px) translateX(calc(100% * var(--offset))) rotateY(calc(-45deg * var(--dir)));
    box-shadow: 0 10px 20px rgba(0,0,0,0.2); /* Add subtle shadow */
    border-radius: 8px; /* Optional: rounded corners */
    overflow: hidden; /* Ensure inner content doesn't overflow */
  }

  .slideContentInner {
    padding: 1.5rem; /* Add padding */
    transform-style: preserve-3d;
    transform: translateZ(3rem); /* Bring content forward */
    transition: opacity 0.4s linear;
    text-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.6); /* Enhanced text shadow */
    opacity: 0;
    color: #fff; /* Ensure text is white */
    background: rgba(0, 0, 0, 0.4); /* Slight overlay for readability */
    border-radius: 6px; /* Match outer radius if needed */
    max-width: 90%; /* Prevent text from touching edges */
  }

  .slideTitle,
  .slideSubtitle {
    font-size: 1.5rem; /* Adjust size */
    font-weight: bold; /* Bolder title */
    letter-spacing: 0.1ch;
    text-transform: uppercase;
    margin: 0 0 0.5rem 0; /* Spacing */
  }

   .slideSubtitle {
      font-size: 1rem; /* Smaller subtitle */
      font-weight: normal;
   }

  .slideSubtitle::before {
    content: "— ";
  }

  .slideDescription {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.15ch;
    line-height: 1.4;
  }

  .slideBackground {
    position: fixed;
    top: 0;
    left: -10%;
    right: -10%;
    bottom: 0;
    background-size: cover;
    background-position: center center;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s linear, transform 0.4s ease-in-out;
    pointer-events: none;
    transform: translateX(calc(8% * var(--dir))); /* Slightly less movement */
    filter: blur(15px); /* More blur */
  }

  /* Active slide specific styles */
  .slide[data-active="true"] {
    z-index: 2;
    pointer-events: auto;
  }

  .slide[data-active="true"] .slideBackground {
    opacity: 0.15; /* Less visible background */
    transform: none;
    filter: blur(10px);
  }

  .slide[data-active="true"] .slideContentInner {
    opacity: 1;
  }

  .slide[data-active="true"] .slideContent {
    opacity: 1;
    transform: perspective(1000px); /* Reset transform for active slide base state */
     --x: calc(var(--px) - 0.5);
     --y: calc(var(--py) - 0.5);
  }

  .slide[data-active="true"] .slideContent:hover {
    transition: none; /* Disable transition on hover for immediate feedback */
    transform: perspective(1000px) rotateY(calc(var(--x) * 35deg)) rotateX(calc(var(--y) * -35deg)); /* Slightly less tilt */
  }

  /* --- Loading/Empty State --- */
  .loading-placeholder {
     color: #ccc;
     text-align: center;
     font-size: 1.2rem;
  }

  /* --- Overall Section Styling --- */
  .hero-section-content {
      /* Styles for the title and 'View All' button if needed */
      text-align: center;
      margin-bottom: 2rem; /* Space above the slider */
  }

   .hero-section-title h1 {
      font-size: 2.5rem; /* Adjust as needed */
      font-weight: bold;
      color: #333; /* Darker text color */
      margin-bottom: 0.5rem;
   }
   .hero-section-title span.primary-color {
       color: #2c7873; /* Your primary color */
   }
    .hero-section-title p {
       color: #666; /* Subtitle color */
       font-size: 1rem;
    }

    .view-all-button-container {
       margin-top: 2rem; /* Space below slider */
    }
`;

// --- useTilt Hook (from example) ---
function useTilt(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined,
    };

    let el = ref.current;

    const handleMouseMove = (e) => {
      if (!el) {
        return;
      }
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty("--px", px);
      el.style.setProperty("--py", py);
    };

    el.addEventListener("mousemove", handleMouseMove);

    // Reset tilt when mouse leaves
    const handleMouseLeave = () => {
        if(el) {
            el.style.setProperty("--px", 0.5);
            el.style.setProperty("--py", 0.5);
        }
    }
    el.addEventListener("mouseleave", handleMouseLeave);


    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [active]);

  return ref;
}

// --- Reducer for Slide Index ---
const slidesReducer = (state, event) => {
  switch (event.type) {
    case "NEXT":
      return {
        ...state,
        slideIndex: (state.slideIndex + 1) % state.totalSlides,
      };
    case "PREV":
      return {
        ...state,
        slideIndex:
          state.slideIndex === 0 ? state.totalSlides - 1 : state.slideIndex - 1,
      };
    case "SET_SLIDES":
      return {
        ...state,
        totalSlides: event.payload,
        slideIndex: 0, // Reset index when slides are set/updated
      };
    default:
      return state;
  }
};

// --- Slide Component ---
function Slide({ event, offset }) {
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  // Use placeholder image if event.image_url is missing
  const imageUrl = event.image_url || 'https://via.placeholder.com/800x600?text=Event+Image';
  // Provide default text if properties are missing
  const title = event.event_name || "Event Title";
  const subtitle = event.venue || "Event Venue"; // Using venue as subtitle
  const description = event.event_description || "No description available.";

  return (
    <div
      ref={ref}
      className="slide"
      data-active={active}
      style={{
        "--offset": offset,
        "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1,
        // Add pointerEvents none if not active to prevent accidental interactions
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {/* Background element for blurred effect */}
      <div
        className="slideBackground"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      />
      {/* Main slide content */}
      <div
        className="slideContent"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          // Set initial perspective values for tilt calculation
          '--px': 0.5,
          '--py': 0.5,
        }}
      >
        
      </div>
    </div>
  );
}

// --- HeroSection Component ---
export default function HeroSection() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  
   const initialState = {
       slideIndex: 0,
       totalSlides: 0
   };
  const [state, dispatch] = useReducer(slidesReducer, initialState);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await eventsApi.getAll();
        const events = response.data || [];
        const displayEvents = events.slice(0, 5); // Take max 5 events
        setFeaturedEvents(displayEvents);
        dispatch({ type: 'SET_SLIDES', payload: displayEvents.length }); // Update reducer with number of slides
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        dispatch({ type: 'SET_SLIDES', payload: 0 }); // Reset slides on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  
   useEffect(() => {
       if (featuredEvents.length <= 1) return; // Don't auto-advance if 0 or 1 slide

       const interval = setInterval(() => {
           dispatch({ type: "NEXT" });
       }, 5000); // Change slide every 5 seconds

       return () => clearInterval(interval); // Cleanup interval on unmount
   }, [featuredEvents.length]); // Re-run if the number of events changes


   // Function to get the slides array for rendering (handles looping)
   const getSlidesForRender = () => {
      if (featuredEvents.length === 0) return [];
      // Create a larger array for pseudo-infinite effect, similar to the example
      // [S4, S0, S1, S2, S3, S4, S0] for 5 slides (index 0)
      // Adjust based on how many neighbors you want visible
      const slides = featuredEvents;
      const length = slides.length;
      // Simple duplication: good for basic cases
      // return [...slides, ...slides, ...slides];
      // More robust way for centering the current slide:
      const extendedSlides = [];
      const RENDER_RANGE = 2; // How many slides to show on each side
      for (let i = -RENDER_RANGE; i <= RENDER_RANGE; i++) {
          let index = (state.slideIndex + i) % length;
          if (index < 0) index += length; // Handle negative modulo result
          extendedSlides.push({ ...slides[index], originalIndex: index, keyIndex: state.slideIndex + i});
      }
      return extendedSlides;
   }

  const slidesToRender = getSlidesForRender();


  return (
    <div className="w-full bg-white ">
       {/* Inject styles */}
      <style>{styles}</style>

      <div className="container mx-auto ">
        

        {/* Slider Container */}
        <div className="hero-slides-container">
          {isLoading ? (
             <div className="loading-placeholder">Loading events...</div>
          ) : error ? (
             <div className="loading-placeholder" style={{color: 'red'}}>{error}</div>
          ) : featuredEvents.length === 0 ? (
              <div className="loading-placeholder">No featured events currently available.</div>
          ) : (
            <div className="hero-slides">
              <button onClick={() => dispatch({ type: "PREV" })}>‹</button>

              {/* Render slides based on calculated offset */}
               {slidesToRender.map((eventData, i) => {
                   // Calculate offset relative to the center item in slidesToRender
                   const centerIndex = Math.floor(slidesToRender.length / 2);
                   const offset = i - centerIndex;
                   return (
                       <Slide
                           event={eventData}
                           offset={offset}
                           key={eventData.keyIndex} // Use a key that accounts for potential duplication
                        />
                   );
               })}

              {/* Render slides using the original example's logic (might be less smooth for few items) */}
              {/* {[...featuredEvents, ...featuredEvents, ...featuredEvents].map((event, i) => {
                   let offset = featuredEvents.length + (state.slideIndex - i);
                   // Normalize offset for display range (e.g., show only nearby slides)
                   // This part depends heavily on how many slides you want visible/partially visible
                   // Let's keep it simple first, showing all calculated offsets
                   return <Slide event={event} offset={offset} key={i} />;
               })} */}

              <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
            </div>
          )}
        </div>

        {/* View All Events Button */}
        {!isLoading && !error && featuredEvents.length > 0 && (
          <div className="view-all-button-container flex justify-center mt-8">
            <Button
              variant="outline"
              className="rounded-md px-6 border-gray-300 hover:bg-gray-100 transition-colors text-[#2c7873] hover:text-[#205854]" // Use primary color
              onClick={() => navigate("/events")}
            >
              <span className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
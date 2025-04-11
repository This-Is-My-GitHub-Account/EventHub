import Header from "../../components/layout/header"
import Footer from "../../components/layout/footer"
import HeroSection from "./hero-section"
import DepartmentEvents from "./department-events"
import StatsSection from "./stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DepartmentEvents />
        <StatsSection />
      </main>
      <Footer />
    </div>
  )
}

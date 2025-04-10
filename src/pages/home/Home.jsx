import HeroSection from './components/HeroSection';
import DepartmentEvents from './components/DepartmentEvents';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <DepartmentEvents />
    </div>
  );
}

export default Home;
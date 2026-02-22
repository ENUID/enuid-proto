import { useState } from 'react';
import Cursor from './components/Cursor';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Hero from './components/Hero';
import ResearchLog from './components/ResearchLog';
import About from './components/About';
import FluidOrbit from './components/FluidOrbit';
import Manifesto from './components/Manifesto';
import Footer from './components/Footer';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      <Cursor />
      <MobileNav />
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <main className={`main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Hero />
        <ResearchLog />
        <About />
        <FluidOrbit />
        <Manifesto />
        <Footer />
      </main>
    </>
  );
}

export default App;

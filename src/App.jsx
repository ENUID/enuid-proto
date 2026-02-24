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
import Journal from './components/Journal';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  const openJournal = (e) => {
    e.preventDefault();
    setShowJournal(true);
    window.scrollTo(0, 0);
  };

  const closeJournal = () => {
    setShowJournal(false);
    window.scrollTo(0, 0);
  };

  if (showJournal) {
    return (
      <>
        <Cursor />
        <Journal onBack={closeJournal} />
      </>
    );
  }

  return (
    <>
      <Cursor />
      <MobileNav onJournal={openJournal} />
      <Sidebar onToggle={setIsSidebarCollapsed} onJournal={openJournal} />
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

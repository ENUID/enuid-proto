import { useEffect, useState } from 'react';

function Sidebar({ onToggle }) {
  const [activeSection, setActiveSection] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], footer[id]');
      const scrollY = window.scrollY;
      let current = '';

      sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 240) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <>
      {isCollapsed && (
        <button 
          className="sidebar-expand-btn" 
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
        >
          <span></span>
          <span></span>
        </button>
      )}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} aria-label="Desktop navigation">
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span></span>
        <span></span>
      </button>
      <div>
        <div className="logo-mark">ENUID</div>
        <div className="logo-sub">
        </div>
      </div>
      <nav>
        <div className="nav-section">
          <div className="nav-label">Navigate</div>
          <a href="#research" className={`nav-link ${activeSection === 'research' ? 'active' : ''}`}>
            Research Log
          </a>
          <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>
            About
          </a>
          <a href="#fluid-orbit" className={`nav-link ${activeSection === 'fluid-orbit' ? 'active' : ''}`}>
            Fluid Orbit
          </a>
          <a href="#manifesto" className={`nav-link ${activeSection === 'manifesto' ? 'active' : ''}`}>
            Manifesto
          </a>
        </div>
        <div className="nav-section">
          <div className="nav-label">Connect</div>
          <a href="#footer" className={`nav-link ${activeSection === 'footer' ? 'active' : ''}`}>
            Contact
          </a>
          <a href="#" className="nav-link">
            Careers
          </a>
        </div>
      </nav>
      <div className="sidebar-footer">
        <div>
          <span className="status-dot"></span>Lab is active
        </div>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;

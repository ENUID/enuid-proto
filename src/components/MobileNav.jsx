import { useState } from 'react';

function MobileNav({ onJournal }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="mobile-bar" id="mobileBar">
        <div className="mobile-logo">ENUID</div>
        <button
          className={`menu-btn ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`} aria-label="Site navigation">
        <a href="#research" className="nav-link" onClick={closeMenu}>
          Research Log
        </a>
        <a href="#about" className="nav-link" onClick={closeMenu}>
          About
        </a>
        <a href="#fluid-orbit" className="nav-link" onClick={closeMenu}>
          Fluid Orbit
        </a>
        <a href="#manifesto" className="nav-link" onClick={closeMenu}>
          Manifesto
        </a>
        <a href="#journal" className="nav-link" onClick={(e) => { closeMenu(); onJournal(e); }}>
          Journal
        </a>
        <a href="#footer" className="nav-link" onClick={closeMenu}>
          Contact
        </a>
      </nav>
    </>
  );
}

export default MobileNav;

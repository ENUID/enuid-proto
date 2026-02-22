# ENUID Labs - React + Vite

A modern, responsive website for ENUID AI Research Lab built with React and Vite.

## Features

- ✨ Fully responsive design (desktop, tablet, mobile)
- 🎨 Custom cursor on desktop
- 📱 Mobile navigation drawer
- 🎭 Smooth scroll animations
- 🎯 Intersection Observer for scroll-triggered animations
- 🎨 Beautiful typography with Google Fonts (Playfair Display, DM Mono, Newsreader)
- 🌾 Subtle grain texture overlay

## Tech Stack

- React 19.2.0
- Vite 7.3.1
- Pure CSS (no CSS frameworks)

## Getting Started

### Install dependencies (if not already installed)
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Cursor.jsx          # Custom cursor component
│   ├── Sidebar.jsx         # Desktop sidebar navigation
│   ├── MobileNav.jsx       # Mobile navigation
│   ├── Hero.jsx            # Hero section
│   ├── ResearchLog.jsx     # Research log section
│   ├── About.jsx           # About section
│   ├── FluidOrbit.jsx      # Fluid Orbit product section
│   ├── Manifesto.jsx       # Manifesto section
│   └── Footer.jsx          # Footer section
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Components

### Cursor
Custom cursor that follows mouse movement and expands on hover over interactive elements (desktop only).

### Sidebar
Fixed sidebar navigation with active section highlighting based on scroll position.

### MobileNav
Responsive mobile navigation with hamburger menu and slide-down drawer.

### Hero
Landing section with headline, annotation, and statistics bar.

### ResearchLog
Timeline of research updates with scroll-triggered fade-in animations.

### About
Company information with principles grid and fade-up animations.

### FluidOrbit
Product showcase with terminal demo and feature cards.

### Manifesto
Quote section with large background letter.

### Footer
Site footer with links and contact information.

## Styling

All styles are contained in `src/index.css` using CSS custom properties (variables) for theming:

- `--paper`: Background color
- `--ink`: Primary text color
- `--accent`: Accent color (orange)
- `--dark-bg`: Dark background
- And many more...

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private project for ENUID Labs

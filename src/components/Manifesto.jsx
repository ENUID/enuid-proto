import { useEffect, useRef } from 'react';

function Manifesto() {
  const fadeUpRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (fadeUpRef.current) {
      observer.observe(fadeUpRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="manifesto" id="manifesto">
      <div className="bg-letter" aria-hidden="true">
        ENUID
      </div>
      <div className="manifesto-inner fade-up" ref={fadeUpRef}>
        <div className="rule-accent"></div>
        <p className="manifesto-quote">
          "Intelligence is not a badge.
          <br />
          It is a <em>responsibility.</em>"
        </p>
        <div className="manifesto-attr">ENUID — Research Lab, 2026</div>
      </div>
    </section>
  );
}

export default Manifesto;

import { useEffect, useRef } from 'react';

function FluidOrbit() {
  const fadeUpRefs = useRef([]);
  const featureRefs = useRef([]);

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

    [...fadeUpRefs.current, ...featureRefs.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '◎',
      name: 'Intent Search',
      desc: 'Describe what you want, not what it is called. Fluid Orbit translates language into products.',
    },
    {
      icon: '◈',
      name: 'Independent Stores',
      desc: 'Every result from a vetted independent brand. No Amazon. No marketplaces. No ads.',
    },
    {
      icon: '◷',
      name: 'Agentic Checkout',
      desc: 'Say yes. Fluid Orbit handles the rest. Cart, checkout, confirmation, tracking. Coming soon.',
    },
    {
      icon: '◍',
      name: 'Try-On Layer',
      desc: 'See it on before you buy. Visual try-on built into the conversation. In development.',
    },
  ];

  return (
    <section className="fluid-orbit" id="fluid-orbit">
      <div className="orbit-inner">
        <div className="orbit-label">First Product</div>
        <h2 className="orbit-heading fade-up" ref={(el) => (fadeUpRefs.current[0] = el)}>
          Fluid
          <br />
          <em>Orbit.</em>
        </h2>
        <div className="orbit-two-col">
          <div className="orbit-desc fade-up" ref={(el) => (fadeUpRefs.current[1] = el)}>
            <p>
              A Shopping OS. You describe what you want in plain language. Fluid Orbit understands
              your intent and finds the best products from independent, trusted stores.
            </p>
            <p>No monopolized marketplaces. No ads. No sponsored placements. Only quality, trust, and convenience.</p>
            <p>
              We start with conversational search. Then we expand into comparison, purchase, try-on,
              agentic checkout, and delivery. All in one place. All by conversation.
            </p>
          </div>
          <div className="terminal fade-up" ref={(el) => (fadeUpRefs.current[2] = el)}>
            <div className="terminal-header">
              <div className="t-dot"></div>
              <div className="t-dot"></div>
              <div className="t-dot"></div>
              <div className="terminal-label">Fluid Orbit - Shopping OS</div>
            </div>
            <div className="terminal-body">
              <div className="t-line">— Fluid Orbit</div>
              <br />
              <div>
                <span className="t-prompt">you → </span>
                <span className="t-user">
                  I need a bag for a weekend trip, earthy colors, from a small brand
                </span>
              </div>
              <br />
              <div className="t-response">Understanding intent... looking beyond categories...</div>
              <br />
              <div className="t-result">Found 6 matches from independent stores</div>
              <div className="t-line">→ Tanner Goods — Waxed Canvas Weekender, Bark</div>
              <div className="t-line">→ Frost River — Isle Royale Pack, Heritage Brown</div>
              <div className="t-line">→ Ona Bags — Bowery Tote, Field Tan</div>
              <br />
              <div>
                <span className="t-prompt">you → </span>
                <span className="t-cursor"></span>
              </div>
            </div>
          </div>
        </div>
        <div className="orbit-features">
          {features.map((feature, index) => (
            <div
              key={index}
              className="orbit-feature"
              ref={(el) => (featureRefs.current[index] = el)}
              style={{ transitionDelay: `${index * 0.09}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-name">{feature.name}</div>
              <div className="feature-desc">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FluidOrbit;

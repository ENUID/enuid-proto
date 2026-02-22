import { useEffect, useRef } from 'react';

function About() {
  const fadeUpRefs = useRef([]);

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

    fadeUpRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      num: '01',
      text: (
        <>
          <strong>Build by intention.</strong> Every decision in our systems has a reason. We
          document it, question it, and stand behind it.
        </>
      ),
    },
    {
      num: '02',
      text: (
        <>
          <strong>Think, adapt, respect.</strong> The systems we build should think clearly, adapt
          to real context, and treat humans with care.
        </>
      ),
    },
    {
      num: '03',
      text: (
        <>
          <strong>No hype. No trends.</strong> We do not build for press cycles or funding rounds.
          We build for the people who will actually use what we make.
        </>
      ),
    },
    {
      num: '04',
      text: (
        <>
          <strong>Transparency first.</strong> Every system we ship should explain itself. Black
          boxes are a design failure, not a feature.
        </>
      ),
    },
  ];

  return (
    <section className="section-about" id="about">
      <div className="section-label" data-num="02">
        About ENUID
      </div>
      <div className="about-grid">
        <div>
          <h2 className="about-heading fade-up" ref={(el) => (fadeUpRefs.current[0] = el)}>
            Intelligence
            <br />
            is a<br />
            <em>responsibility.</em>
          </h2>
          <div className="about-body fade-up" ref={(el) => (fadeUpRefs.current[1] = el)}>
            <p>
              ENUID is an independent AI research lab. Not aligned with trends. Not chasing
              investment narratives. We study intelligence as a discipline, build it as a craft, and
              ship it as a tool that works for the people using it.
            </p>
            <p>
              The current state of AI often values performance over usefulness. A system that looks
              intelligent is rewarded before a system that is intelligent. We challenge that every
              day.
            </p>
            <p>
              Our work starts with one question: what does this person actually need? Everything
              else follows from the answer.
            </p>
          </div>
        </div>
        <div className="about-principles fade-up" ref={(el) => (fadeUpRefs.current[2] = el)}>
          {principles.map((principle, index) => (
            <div key={index} className="principle">
              <div className="principle-num">{principle.num}</div>
              <div className="principle-text">{principle.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;

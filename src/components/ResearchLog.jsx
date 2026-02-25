import { useEffect, useRef } from 'react';

function ResearchLog() {
  const entriesRef = useRef([]);

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

    entriesRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const logEntries = [
    {
      date: '2026.02.25',
      text: 'Intent-based product search produces more accurate results than keyword matching when users describe a feeling rather than a category. Testing at scale with Fluid Orbit.',
      tag: 'Fluid Orbit',
    },
    {
      date: '2026.02.19',
      text: 'Systems that explain their reasoning earn more trust than systems that simply output answers. Transparency is not a feature, it is a foundation.',
      tag: 'Research',
    },
    {
      date: '2026.02.15',
      text: 'Independent store search requires rethinking how trust and quality work online. Reviews from monopolized platforms cannot transfer. We are building new trust infrastructure.',
      tag: 'Trust Systems',
    },
    {
      date: '2026.02.07',
      text: 'Conversational interfaces outperform filter-based search for users who know what they want but not what it is called. Language is the best search query.',
      tag: 'Interaction',
    },
    {
      date: '2026.02.04',
      text: 'ENUID founded. First question asked: what would shopping look like if it respected the person shopping? We are still answering it.',
      tag: 'Origin',
    },
  ];

  return (
    <section className="research-log" id="research">
      <div className="log-header">
        <div className="log-title">
          <span className="status-dot"></span>Research Log — Live
        </div>
        <div className="log-updated">UPDATED CONTINUOUSLY</div>
      </div>
      <div className="log-entries">
        {logEntries.map((entry, index) => (
          <div
            key={index}
            className="log-entry"
            ref={(el) => (entriesRef.current[index] = el)}
            style={{ transitionDelay: `${index * 0.07}s` }}
          >
            <div className="log-date">{entry.date}</div>
            <div className="log-text">{entry.text}</div>
            <div className="log-tag">{entry.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResearchLog;

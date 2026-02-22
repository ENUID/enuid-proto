function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div>
          <div className="hero-eyebrow">AI Research Lab</div>
          <h1 className="hero-headline">
            Build<br />
            for<br />
            <em>People.</em>
          </h1>
        </div>
        <div className="hero-annotation">
          <strong>Current Focus</strong>
          Intelligence should not be built by accident. We study, question, build, break, and rebuild
          until it is actually useful. Not impressive. Useful.
          <br />
          <br />
          We are building the tools that should exist.
        </div>
      </div>
      <div className="hero-bar">
        <div className="hero-stat">
          <div className="stat-num">01</div>
          <div className="stat-label">Product shipping</div>
        </div>
        <div className="hero-stat">
          <div className="stat-num">∞</div>
          <div className="stat-label">Questions asked</div>
        </div>
        <div className="hero-stat">
          <div className="stat-num">0</div>
          <div className="stat-label">Trends chased</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

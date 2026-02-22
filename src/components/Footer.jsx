function Footer() {
  return (
    <footer className="footer" id="footer">
      <div>
        <div className="footer-brand">ENUID</div>
        <div className="footer-tagline">Building for people.</div>
      </div>
      <div>
        <div className="footer-col-title">Lab</div>
        <a href="#research" className="footer-link">
          Research Log
        </a>
        <a href="#" className="footer-link">
          Publications
        </a>
        <a href="#fluid-orbit" className="footer-link">
          Fluid Orbit
        </a>
        <a href="#" className="footer-link">
          Careers
        </a>
      </div>
      <div>
        <div className="footer-col-title">Info</div>
        <div className="footer-note">
          ENUID is an independent AI research lab, not affiliated with any major tech company.
          Funded by people who believe intelligence should work for humans.
          <br />
          <br />
          accounts@enuid.com
        </div>
      </div>
    </footer>
  );
}

export default Footer;

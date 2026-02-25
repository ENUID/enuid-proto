import { useState } from 'react';

function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
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
          <button
            className="footer-link privacy-btn"
            onClick={() => setShowPrivacy(true)}
          >
            Privacy
          </button>
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

      {showPrivacy && (
        <div className="privacy-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="privacy-close"
              onClick={() => setShowPrivacy(false)}
              aria-label="Close privacy policy"
            >
              ✕
            </button>

            <h2 className="privacy-title">Privacy Policy</h2>
            {/* <p className="privacy-updated">Last updated 3/December/2025</p> */}

            <p>
              ENUID is an independent AI lab exploring new systems, experiments, and
              prototypes. This policy explains what we collect and how we handle it
              while we continue to build and test our work.
            </p>

            <h3>Information we collect</h3>
            <p>
              We collect limited information to keep the lab running and to understand
              how people use our work. This includes:
            </p>
            <ul>
              <li>Information you share with us, such as your name or email if you contact us</li>
              <li>Inputs you submit in our demos or prototypes</li>
              <li>Basic analytics like device type, IP address, and usage patterns</li>
            </ul>

            <h3>How we use the information</h3>
            <p>We use this information to:</p>
            <ul>
              <li>Operate and improve our experiments and prototypes</li>
              <li>Understand how people interact with our work</li>
              <li>Keep the lab's systems secure</li>
              <li>Communicate with you when needed</li>
            </ul>

            <h3>Sharing</h3>
            <p>
              We do not sell your personal data. We share information only with
              trusted service providers that help us host or operate parts of the site
              or when required by law.
            </p>

            <h3>Data retention</h3>
            <p>
              We store data only for as long as needed to run and improve our
              experiments. You can request deletion of your data at any time.
            </p>

            <h3>Security</h3>
            <p>
              We follow reasonable security practices for early stage research and
              experimental systems. While we work to protect your information, no
              system is perfectly secure.
            </p>

            <h3>Your choices</h3>
            <p>You can contact us to access, update, or delete your information.</p>

            <h3>Changes</h3>
            <p>
              As the lab evolves and our work expands, we may update this policy. We
              will reflect changes on this page.
            </p>

            <h3>Contact</h3>
            <p>For any questions about this policy:</p>
            <a href="mailto:no-reply@enuid.com" className="privacy-email">
              no-reply@enuid.com
            </a>
            <p className="privacy-brand-line">
              <strong>ENUID</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;

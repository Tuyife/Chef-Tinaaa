import { Link } from 'react-router-dom';
import { ChefHat, Phone, Mail, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand footer-logo">
              <ChefHat size={26} aria-hidden="true" />
              <span>Glory Catering Service</span>
            </div>
            <p className="footer-tag">
              Good food. Great moments. Bespoke catering and private chef experiences crafted with passion.
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><XIcon /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Private Chef</Link></li>
              <li><Link to="/services">Catering Services</Link></li>
              <li><Link to="/services">Event Catering</Link></li>
              <li><Link to="/services">Meal Preparation</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in Touch</h4>
            <ul className="footer-contact">
              <li><Phone size={15} aria-hidden="true" /><span>+234 905 482 0983</span></li>
              <li><Mail size={15} aria-hidden="true" /><span>glorycateringservices20@gmail.com</span></li>
              <li><MapPin size={15} aria-hidden="true" /><span>Osun, Nigeria</span></li>
            </ul>
            <Link to="/contact" className="btn btn--primary btn--sm">
              Make an Enquiry <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Glory Catering Service. All rights reserved.</p>
          <p className="footer-admin">
            <Link to="/admin/login" className="admin-link" title="Admin Login" aria-label="Admin Login">
              <ShieldCheck size={14} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

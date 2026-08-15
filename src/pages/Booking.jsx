import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import BookingWizard from '../components/booking/BookingWizard.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Booking() {
  const { user } = useAuth();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Booking</p>
          <h1 className="title">Book <span className="accent">Glory Catering Service</span></h1>
          <p className="sub">Choose a service and we’ll ask exactly what we need to prepare it for you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container booking-wrap">
          <Reveal className="booking-form-wrap">
            <BookingWizard user={user} />
          </Reveal>

          <Reveal delay={120} className="booking-side">
            <div className="card side-card">
              <h3>What Happens Next?</h3>
              <ol className="steps">
                <li><span>1</span>We review your request and confirm availability.</li>
                <li><span>2</span>We schedule a short consultation to plan the menu.</li>
                <li><span>3</span>You receive a quote and a confirmed booking.</li>
                <li><span>4</span>We handle everything on the day — you enjoy the moment.</li>
              </ol>
            </div>
            <div className="card side-card side-card--accent">
              <h3>Need Help?</h3>
              <p>Call or WhatsApp us anytime and we’ll guide you through the process.</p>
              <a href="tel:+2348065186605" className="btn btn--primary btn--sm btn--block">
                <Phone size={15} /> +234 806 518 6605
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

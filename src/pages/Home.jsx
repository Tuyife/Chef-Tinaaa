import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Star,
  CalendarCheck,
  Users,
  Leaf,
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
} from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { api } from '../lib/api.js';

const HERO_STATS = [
  { value: '500+', label: 'Events Served' },
  { value: '8+', label: 'Years Experience' },
  { value: '98%', label: 'Happy Clients' },
];

const SPECIALTIES = [
  {
    icon: ChefHat,
    title: 'Private Chef',
    text: 'A personal chef experience in the comfort of your home, with menus tailored to your taste.',
    to: '/booking',
  },
  {
    icon: CalendarCheck,
    title: 'Event Catering',
    text: 'End-to-end catering for weddings, birthdays and corporate events that leave guests talking.',
    to: '/booking',
  },
  {
    icon: UtensilsCrossed,
    title: 'Meal Preparation',
    text: 'Fresh, healthy meals planned around your goals and delivered with consistency.',
    to: '/booking',
  },
];

const VALUES = [
  { icon: Leaf, title: 'Fresh Ingredients', text: 'Locally sourced produce selected daily.' },
  { icon: Users, title: 'Full-Service Team', text: 'A professional crew handling every detail.' },
  { icon: Star, title: 'Signature Flavour', text: 'Recipes crafted to be truly memorable.' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactState, setContactState] = useState({ status: 'idle', error: '' });

  useEffect(() => {
    api('/services').then((d) => setServices(d.services)).catch(() => {});
    api('/testimonials/public').then((d) => setTestimonials(d.testimonials)).catch(() => {});
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setContactState({ status: 'loading', error: '' });
    try {
      await api('/messages', { method: 'POST', body: contact });
      setContactState({ status: 'success', error: '' });
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setContactState({ status: 'idle', error: err.message });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow">Bespoke Catering &amp; Private Chef</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="hero-title">
                GOOD FOOD. <span className="accent">GREAT MOMENTS.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="hero-sub">
                From intimate dinners to grand celebrations, Glory Catering Service brings restaurant-quality
                cooking and flawless service to your table.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="hero-actions">
                <Link to="/booking" className="btn btn--primary">
                  Book a Chef <ArrowRight size={17} />
                </Link>
                <Link to="/services" className="btn btn--outline">
                  Explore Services
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="hero-stats">
                {HERO_STATS.map((s) => (
                  <div className="hero-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="hero-media">
            <div className="hero-img-frame">
              <img src="/images/food-bowl2.jpg" alt="Glory Catering Service signature dish" />
              <div className="hero-badge">
                <span className="hero-badge-icon"><ChefHat size={18} /></span>
                <div>
                  <strong>Private Chef</strong>
                  <span>Available for hire</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">What We Do</p>
            <h2 className="section-title">Signature <span className="accent">Specialities</span></h2>
            <p className="section-sub">Every service is tailored to your occasion, budget and taste.</p>
          </Reveal>
          <div className="grid-3">
            {SPECIALTIES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="card specialty-card">
                <span className="card-icon"><s.icon size={24} aria-hidden="true" /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link to={s.to} className="link-arrow">
                  Book this service <ArrowUpRight size={15} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SPLIT */}
      <section className="section section--flush experience">
        <div className="container split">
          <Reveal className="split-media">
            <img src="/images/chef-cooking.jpg" alt="Glory Catering Service cooking in the kitchen" />
            <img className="split-media-small" src="/images/plated-dish.jpg" alt="Plated fine dining dish" />
          </Reveal>
          <div className="split-copy">
            <Reveal>
              <p className="eyebrow">The Experience</p>
              <h2 className="section-title">Cooking Is Art. <span className="accent">Flavour Is Memory.</span></h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="body-copy">
                Glory Catering Service blends bold local ingredients with refined technique to create food that
                feels both familiar and extraordinary. Every plate is prepared with intention, every
                event handled with care from first consultation to the last course.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="value-list">
                {VALUES.map((v) => (
                  <div className="value-item" key={v.title}>
                    <span className="card-icon small"><v.icon size={18} aria-hidden="true" /></span>
                    <div>
                      <h4>{v.title}</h4>
                      <p>{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <Link to="/about" className="btn btn--dark">
                More About Glory Catering Service <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Menu of Services</p>
            <h2 className="section-title">Services &amp; <span className="accent">Experiences</span></h2>
            <p className="section-sub">Choose a service and book a consultation in minutes.</p>
          </Reveal>
          <div className="grid-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s._id} delay={(i % 3) * 80} className="card service-card">
                <div className="service-card-img">
                  <img src={s.image || '/images/food-bowl.jpg'} alt={s.name} loading="lazy" />
                </div>
                <div className="service-card-body">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <Link to="/booking" className="link-arrow">
                    Book this service <ArrowUpRight size={15} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="section-more">
            <Link to="/services" className="btn btn--outline">
              View All Services <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--dark">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">Kind Words</p>
            <h2 className="section-title">What Guests <span className="accent">Say</span></h2>
          </Reveal>
          <div className="grid-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t._id} delay={i * 80} className="card quote-card">
                <div className="quote-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="quote-text">“{t.message}”</p>
                <div className="quote-author">
                  <span className="quote-avatar">{t.customerName.charAt(0)}</span>
                  <div>
                    <strong>{t.customerName}</strong>
                    <span>{t.service}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DARK BOOKING CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <Reveal className="cta-copy">
            <p className="eyebrow">Ready When You Are</p>
            <h2 className="cta-title">Let’s Create Something <span className="accent">Delicious</span> Together</h2>
            <p className="cta-sub">Tell us about your event and we’ll craft a menu and plan that fits it perfectly.</p>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/booking" className="btn btn--primary btn--lg">
              Start a Booking <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact-section">
        <div className="container split contact-split">
          <div className="split-copy">
            <Reveal>
              <p className="eyebrow">Get in Touch</p>
              <h2 className="section-title">Have a Question? <span className="accent">Say Hello.</span></h2>
              <p className="body-copy">
                Reach out for enquiries, event planning or a private chef consultation. We usually
                respond within one business day.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="contact-channels">
                <a href="tel:+2348065186605" className="channel">
                  <span className="card-icon small"><Phone size={18} /></span>
                  <div><strong>Call or WhatsApp</strong><span>+234 806 518 6605</span></div>
                </a>
                <a href="tel:+2349054820983" className="channel">
                  <span className="card-icon small"><Phone size={18} /></span>
                  <div><strong>Call or WhatsApp</strong><span>+234 905 482 0983</span></div>
                </a>
                <a href="mailto:glorycateringservices20@gmail.com" className="channel">
                  <span className="card-icon small"><Mail size={18} /></span>
                  <div><strong>Email</strong><span>glorycateringservices20@gmail.com</span></div>
                </a>
                <div className="channel">
                  <span className="card-icon small"><MapPin size={18} /></span>
                  <div><strong>Location</strong><span>Lagos, Nigeria</span></div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="contact-form-wrap">
            <form className="contact-form card" onSubmit={sendMessage} noValidate>
              <h3>Send a Message</h3>
              <div className="field field--row">
                <div className="field">
                  <label className="label" htmlFor="home-name">Full Name <span className="req">*</span></label>
                  <input id="home-name" className="input" value={contact.name} required
                    onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your name" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="home-email">Email <span className="req">*</span></label>
                  <input id="home-email" type="email" className="input" value={contact.email} required
                    onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="home-subject">Subject</label>
                <input id="home-subject" className="input" value={contact.subject}
                  onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="What is this about?" />
              </div>
              <div className="field">
                <label className="label" htmlFor="home-message">Message <span className="req">*</span></label>
                <textarea id="home-message" className="input" rows="4" value={contact.message} required
                  onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us about your event or question" />
              </div>

              {contactState.error && <p className="form-error">{contactState.error}</p>}
              {contactState.status === 'success' && (
                <p className="form-success"><CheckCircle2 size={16} /> Your message has been sent. We’ll get back to you shortly.</p>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={contactState.status === 'loading'}>
                {contactState.status === 'loading' ? 'Sending...' : (
                  <>Send Message <Send size={16} /></>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

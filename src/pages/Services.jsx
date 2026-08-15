import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Home, CheckCircle2, CalendarClock, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { api, formatMoney } from '../lib/api.js';

const PERKS = [
  { icon: CalendarClock, title: 'Flexible Scheduling', text: 'Book around your event, not the other way round.' },
  { icon: CheckCircle2, title: 'Custom Menus', text: 'Menus designed around your theme, budget and diet.' },
  { icon: ShieldCheck, title: 'Reliable Service', text: 'A professional team that shows up and delivers.' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/services')
      .then((d) => setServices(d.services))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Services</p>
          <h1 className="title">Services &amp; <span className="accent">Experiences</span></h1>
          <p className="sub">From a quiet dinner for two to a celebration for hundreds — every booking is crafted to impress.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="route-loader"><span className="spinner-dot" /></div>
          ) : (
            <div className="services-list">
              {services.map((s, i) => (
                <Reveal key={s._id} delay={(i % 2) * 100} className="card service-row">
                  <div className="service-row-img">
                    <img src={s.image || '/images/food-bowl.jpg'} alt={s.name} loading="lazy" />
                  </div>
                  <div className="service-row-body">
                    <div className="service-row-head">
                      <h2>{s.name}</h2>
                      <span className="price-tag">{formatMoney(s.price)}<small> starting from</small></span>
                    </div>
                    <p>{s.description}</p>
                    <div className="service-row-actions">
                      <Link to="/booking" state={{ service: s.name }} className="btn btn--primary btn--sm">
                        Book This Service <ArrowRight size={15} />
                      </Link>
                      <Link to="/booking" className="btn btn--outline btn--sm">
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="section-perks">
            <div className="grid-3">
              {PERKS.map((p, i) => (
                <Reveal key={p.title} delay={i * 80} className="card perk-card">
                  <span className="card-icon"><p.icon size={22} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="services-cta">
            <p className="eyebrow">Ready to plan something special?</p>
            <h2 className="section-title">Book a Consultation</h2>
            <p className="section-sub">Tell us your date, location and guest count — we’ll take care of the rest.</p>
            <Link to="/booking" className="btn btn--dark btn--lg">
              Start a Booking <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

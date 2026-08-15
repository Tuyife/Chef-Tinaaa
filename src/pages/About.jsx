import { Link } from 'react-router-dom';
import { Home, ArrowRight, Award, HeartHandshake, Sparkles, ChefHat } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';

const TIMELINE = [
  { year: '2018', text: 'Started as a private home chef, cooking for a small circle of families.' },
  { year: '2020', text: 'Grew into event catering, serving birthdays, weddings and private dinners.' },
  { year: '2023', text: 'Launched full-service event catering for corporate and community events.' },
  { year: '2026', text: 'Today: a trusted name for bespoke catering across Nigeria.' },
];

const PILLARS = [
  { icon: Sparkles, title: 'Craft', text: 'Technique refined through years behind the stove, in every dish.' },
  { icon: HeartHandshake, title: 'Care', text: 'We treat every guest like they are family at our own table.' },
  { icon: Award, title: 'Excellence', text: 'Consistent quality, punctual delivery, impeccable presentation.' },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> About</p>
          <h1 className="title">The Story Behind <span className="accent">Glory Catering Service</span></h1>
          <p className="sub">A chef who believes great food brings people together — and every event deserves to be memorable.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="split-media">
            <img src="/images/chef-portrait.jpg" alt="Portrait of Glory Catering Service" />
          </Reveal>
          <div className="split-copy">
            <Reveal>
              <p className="eyebrow">Meet the Chef</p>
              <h2 className="section-title">Passion for Flavour, <span className="accent">Perfection in Detail</span></h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="body-copy">
                Glory Catering Service started with a simple belief: nobody should have to settle for ordinary
                food at an extraordinary moment. That belief grew into a catering practice built on
                fresh ingredients, bold flavour and warm, professional hospitality.
              </p>
              <p className="body-copy">
                Whether it is a cosy dinner, a busy corporate event or a grand celebration, every
                booking gets the same level of care — a menu designed around you, executed with
                precision, and served with a smile.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="about-quote">
                <ChefHat size={20} />
                <p>“Food is the shortest distance between people. My job is to make that journey delicious.”</p>
                <span>— Glory Catering Service</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">The Journey</p>
            <h2 className="section-title">Milestones Along <span className="accent">the Way</span></h2>
          </Reveal>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 80} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-card">
                  <strong className="timeline-year">{t.year}</strong>
                  <p>{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">What Drives Us</p>
            <h2 className="section-title">Our <span className="accent">Pillars</span></h2>
          </Reveal>
          <div className="grid-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="card perk-card">
                <span className="card-icon"><p.icon size={22} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="services-cta">
            <h2 className="section-title">Let’s cook something special together</h2>
            <Link to="/booking" className="btn btn--dark btn--lg">
              Book Glory Catering Service <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

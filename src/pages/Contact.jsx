import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Send, CheckCircle2, Clock3 } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { api } from '../lib/api.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [state, setState] = useState({ status: 'idle', error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', error: '' });
    try {
      await api('/messages', { method: 'POST', body: form });
      setState({ status: 'success', error: '' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setState({ status: 'idle', error: err.message });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Contact</p>
          <h1 className="title">Get in <span className="accent">Touch</span></h1>
          <p className="sub">Questions, quotes or consultations — we would love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split contact-split">
          <div className="split-copy">
            <Reveal>
              <p className="eyebrow">Contact Details</p>
              <h2 className="section-title">Talk to <span className="accent">Glory Catering Service</span></h2>
              <p className="body-copy">
                The fastest way to reach us is a call or WhatsApp message. For detailed enquiries,
                drop us a message and we will respond within one business day.
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
                  <div><strong>Location</strong><span>Osun, Nigeria</span></div>
                </div>
                <div className="channel">
                  <span className="card-icon small"><Clock3 size={18} /></span>
                  <div><strong>Working Hours</strong><span>Mon – Sat, 9am – 6pm</span></div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="contact-form-wrap">
            <form className="contact-form card" onSubmit={submit} noValidate>
              <h3>Send Us a Message</h3>
              <div className="field field--row">
                <div className="field">
                  <label className="label" htmlFor="c-name">Full Name <span className="req">*</span></label>
                  <input id="c-name" className="input" value={form.name} required onChange={set('name')} placeholder="Your name" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="c-phone">Phone</label>
                  <input id="c-phone" className="input" value={form.phone} onChange={set('phone')} placeholder="+234 ..." />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="c-email">Email <span className="req">*</span></label>
                <input id="c-email" type="email" className="input" value={form.email} required onChange={set('email')} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label className="label" htmlFor="c-subject">Subject</label>
                <input id="c-subject" className="input" value={form.subject} onChange={set('subject')} placeholder="Event enquiry, quote, question..." />
              </div>
              <div className="field">
                <label className="label" htmlFor="c-message">Message <span className="req">*</span></label>
                <textarea id="c-message" className="input" rows="5" value={form.message} required onChange={set('message')} placeholder="Tell us about your event or question" />
              </div>

              {state.error && <p className="form-error">{state.error}</p>}
              {state.status === 'success' && (
                <p className="form-success"><CheckCircle2 size={16} /> Message sent. We’ll be in touch shortly.</p>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={state.status === 'loading'}>
                {state.status === 'loading' ? 'Sending...' : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

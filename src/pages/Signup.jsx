import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, UserRound, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useAuth } from '../lib/auth.jsx';
import { api, getGuestTokens, clearGuestTokens } from '../lib/api.js';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [state, setState] = useState({ status: 'idle', error: '' });

  const claimGuestBookings = async () => {
    const tokens = getGuestTokens();
    if (!tokens.length) return;
    try {
      await api('/bookings/claim', { method: 'POST', body: { guestToken: tokens } });
    } catch {
      /* not critical if claiming fails */
    }
    clearGuestTokens();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setState({ status: 'idle', error: 'Passwords do not match.' });
      return;
    }
    if (form.password.length < 6) {
      setState({ status: 'idle', error: 'Password must be at least 6 characters.' });
      return;
    }
    setState({ status: 'loading', error: '' });
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      await claimGuestBookings();
      navigate('/dashboard');
    } catch (err) {
      setState({ status: 'idle', error: err.message });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <section className="auth-page">
        <div className="container auth-wrap">
          <Reveal className="auth-card card">
            <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Sign Up</p>
            <h1 className="auth-title">Create Your <span className="accent">Account</span></h1>
            <p className="auth-sub">Book chefs, track requests and manage your profile in one place.</p>

            <form onSubmit={submit} noValidate>
              <div className="field">
                <label className="label" htmlFor="s-name"><UserRound size={14} /> Full Name <span className="req">*</span></label>
                <input id="s-name" className="input" value={form.name} required onChange={set('name')} placeholder="Your full name" />
              </div>
              <div className="field">
                <label className="label" htmlFor="s-email"><Mail size={14} /> Email <span className="req">*</span></label>
                <input id="s-email" type="email" className="input" value={form.email} required onChange={set('email')} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label className="label" htmlFor="s-phone"><Phone size={14} /> Phone <span className="req">*</span></label>
                <input id="s-phone" className="input" value={form.phone} required onChange={set('phone')} placeholder="+234 ..." />
              </div>
              <div className="field field--row">
                <div className="field">
                  <label className="label" htmlFor="s-password"><Lock size={14} /> Password <span className="req">*</span></label>
                  <input id="s-password" type="password" className="input" value={form.password} required onChange={set('password')} placeholder="Min 6 characters" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="s-confirm"><Lock size={14} /> Confirm <span className="req">*</span></label>
                  <input id="s-confirm" type="password" className="input" value={form.confirm} required onChange={set('confirm')} placeholder="Repeat password" />
                </div>
              </div>

              {state.error && <p className="form-error">{state.error}</p>}

              <button type="submit" className="btn btn--primary btn--block" disabled={state.status === 'loading'}>
                {state.status === 'loading' ? 'Creating account...' : <>Create Account <CheckCircle2 size={16} /></>}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

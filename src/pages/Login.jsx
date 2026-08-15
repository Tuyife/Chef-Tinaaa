import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, LogIn, Mail, Lock, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useAuth } from '../lib/auth.jsx';
import { api, getGuestTokens, clearGuestTokens } from '../lib/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState({ status: 'idle', error: '' });
  const from = location.state?.booked ? '/dashboard' : (location.state?.from?.pathname || '/');

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
    setState({ status: 'loading', error: '' });
    try {
      const user = await login(form);
      await claimGuestBookings();
      navigate(user.role === 'admin' ? '/admin-panel' : '/dashboard');
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
            <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Sign In</p>
            <h1 className="auth-title">Welcome <span className="accent">Back</span></h1>
            <p className="auth-sub">Sign in to manage your bookings and profile.</p>

            {from && location.state?.booked && (
              <p className="form-success"><CheckCircle2 size={16} /> Your booking was received — sign in to track it.</p>
            )}

            <form onSubmit={submit} noValidate>
              <div className="field">
                <label className="label" htmlFor="l-email"><Mail size={14} /> Email <span className="req">*</span></label>
                <input id="l-email" type="email" className="input" value={form.email} required onChange={set('email')} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label className="label" htmlFor="l-password"><Lock size={14} /> Password <span className="req">*</span></label>
                <input id="l-password" type="password" className="input" value={form.password} required onChange={set('password')} placeholder="Your password" />
              </div>

              {state.error && <p className="form-error">{state.error}</p>}

              <button type="submit" className="btn btn--primary btn--block" disabled={state.status === 'loading'}>
                {state.status === 'loading' ? 'Signing in...' : <>Sign In <LogIn size={16} /></>}
              </button>
            </form>

            <p className="auth-switch">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

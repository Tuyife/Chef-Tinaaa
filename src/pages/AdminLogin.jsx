import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShieldCheck, Lock, Mail } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState({ status: 'idle', error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', error: '' });
    try {
      const user = await login(form);
      if (user.role !== 'admin') {
        setState({ status: 'idle', error: 'This account does not have admin access.' });
        return;
      }
      navigate('/admin-panel', { replace: true });
    } catch (err) {
      setState({ status: 'idle', error: err.message });
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="auth-page">
      <div className="container auth-wrap">
        <Reveal className="auth-card card">
          <span className="card-icon auth-icon"><ShieldCheck size={22} /></span>
          <p className="crumb"><Link to="/"><Home size={14} /> Home</Link> <span>/</span> Admin Login</p>
          <h1 className="auth-title">Admin <span className="accent">Login</span></h1>
          <p className="auth-sub">Staff only — sign in to manage bookings and services.</p>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label className="label" htmlFor="a-email"><Mail size={14} /> Email <span className="req">*</span></label>
              <input id="a-email" type="email" className="input" value={form.email} required onChange={set('email')} placeholder="admin@glorycatering.com" />
            </div>
            <div className="field">
              <label className="label" htmlFor="a-password"><Lock size={14} /> Password <span className="req">*</span></label>
              <input id="a-password" type="password" className="input" value={form.password} required onChange={set('password')} placeholder="Your password" />
            </div>

            {state.error && <p className="form-error">{state.error}</p>}

            <button type="submit" className="btn btn--primary btn--block" disabled={state.status === 'loading'}>
              {state.status === 'loading' ? 'Signing in...' : <>Sign In to Admin <ShieldCheck size={16} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Not an admin? <Link to="/login">Customer sign in</Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

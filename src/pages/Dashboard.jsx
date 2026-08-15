import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Wallet,
  Clock3,
  Plus,
  Home,
  UserRound,
  Phone,
  LogOut,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../components/UI.jsx';
import ServiceDetails from '../components/booking/ServiceDetails.jsx';
import { useAuth } from '../lib/auth.jsx';
import { api, formatDate, formatMoney } from '../lib/api.js';
import { SERVICE_ICONS } from '../lib/bookingServices.js';

const STAT_CARDS = [
  { key: 'total', label: 'Total Bookings', icon: CalendarDays },
  { key: 'pending', label: 'Pending', icon: Clock3 },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'upcoming', label: 'Upcoming Events', icon: Users },
];

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('bookings');
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState('');

  useEffect(() => {
    api('/bookings')
      .then((d) => setBookings(d.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving('profile');
    setMsg({ type: '', text: '' });
    try {
      await updateProfile(profile);
      setMsg({ type: 'ok', text: 'Profile updated successfully.' });
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSaving('');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setSaving('pw');
    setMsg({ type: '', text: '' });
    try {
      await api('/auth/password', { method: 'PUT', body: pw });
      setPw({ currentPassword: '', newPassword: '' });
      setMsg({ type: 'ok', text: 'Password changed successfully.' });
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSaving('');
    }
  };

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const upcoming = bookings.filter((b) => new Date(b.eventDate) > new Date() && ['pending', 'confirmed', 'in_progress'].includes(b.status)).length;
  const stats = { total, pending, confirmed, upcoming };

  return (
    <section className="dash-page">
      <div className="container">
        <div className="dash-head">
          <div>
            <p className="eyebrow">My Dashboard</p>
            <h1 className="dash-title">Hello, {user?.name?.split(' ')[0]}</h1>
          </div>
          <div className="dash-head-actions">
            <Link to="/" className="btn btn--outline">
              <Home size={16} /> Home
            </Link>
            <Link to="/booking" className="btn btn--primary">
              <Plus size={16} /> New Booking
            </Link>
          </div>
        </div>

        <div className="dash-stats">
          {STAT_CARDS.map((c) => (
            <div className="card dash-stat" key={c.key}>
              <span className="card-icon small"><c.icon size={18} /></span>
              <div>
                <strong>{stats[c.key]}</strong>
                <span>{c.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-tabs">
          <button type="button" className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
          <button type="button" className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile &amp; Settings</button>
        </div>

        {tab === 'bookings' && (
          <div className="card dash-panel">
            {loading ? (
              <div className="route-loader"><span className="spinner-dot" /></div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <CalendarDays size={40} />
                <h3>No bookings yet</h3>
                <p>When you book a service, your requests and their status will appear here.</p>
                <Link to="/booking" className="btn btn--primary">Make Your First Booking</Link>
              </div>
            ) : (
              <div className="booking-cards">
                {bookings.map((b) => {
                  const Icon = SERVICE_ICONS[b.serviceType];
                  return (
                    <div className="booking-card card" key={b._id}>
                      <div className="booking-card-head">
                        <div className="booking-card-title">
                          <span className="service-option-icon">{Icon && <Icon size={18} aria-hidden="true" />}</span>
                          <div>
                            <strong>{b.serviceName || b.service?.name}</strong>
                            <small>{b.eventDate ? formatDate(b.eventDate) : '—'}</small>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <ServiceDetails booking={b} showCustomer={false} />
                      <div className="booking-card-foot">
                        <span className="booking-amount">{formatMoney(b.totalAmount)}</span>
                        <StatusBadge status={b.paymentStatus} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="dash-profile">
            <div className="card dash-panel">
              <h3 className="panel-title"><UserRound size={18} /> Personal Information</h3>
              <div className="profile-detail">
                <span className="card-icon small"><UserRound size={16} /></span>
                <div><strong>Name</strong><span>{user?.name}</span></div>
              </div>
              <div className="profile-detail">
                <span className="card-icon small"><Phone size={16} /></span>
                <div><strong>Phone</strong><span>{user?.phone}</span></div>
              </div>
              <div className="profile-detail">
                <span className="card-icon small"><Wallet size={16} /></span>
                <div><strong>Email</strong><span>{user?.email}</span></div>
              </div>

              <form className="profile-form" onSubmit={saveProfile}>
                <div className="field field--row">
                  <div className="field">
                    <label className="label" htmlFor="d-name">Full Name</label>
                    <input id="d-name" className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="d-phone">Phone</label>
                    <input id="d-phone" className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn--dark" disabled={saving === 'profile'}>
                  {saving === 'profile' ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="card dash-panel">
              <h3 className="panel-title"><KeyRound size={18} /> Change Password</h3>
              <form className="profile-form" onSubmit={savePassword}>
                <div className="field">
                  <label className="label" htmlFor="d-cur">Current Password</label>
                  <input id="d-cur" type="password" className="input" value={pw.currentPassword} required onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="d-new">New Password</label>
                  <input id="d-new" type="password" className="input" value={pw.newPassword} required onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} placeholder="Min 6 characters" />
                </div>
                <button type="submit" className="btn btn--dark" disabled={saving === 'pw'}>
                  {saving === 'pw' ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {msg.text && (
              <p className={msg.type === 'ok' ? 'form-success' : 'form-error'}>
                {msg.type === 'ok' && <CheckCircle2 size={16} />} {msg.text}
              </p>
            )}

            <div className="card dash-panel dash-logout">
              <div>
                <h3 className="panel-title"><LogOut size={18} /> Sign Out</h3>
                <p>Sign out of your account on this device.</p>
              </div>
              <button type="button" className="btn btn--outline" onClick={logout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

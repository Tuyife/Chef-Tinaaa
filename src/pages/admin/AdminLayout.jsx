import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ChefHat,
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/auth.jsx';

const LINKS = [
  { to: '/admin-panel', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin-panel/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin-panel/customers', label: 'Customers', icon: Users },
  { to: '/admin-panel/services', label: 'Services', icon: UtensilsCrossed },
  { to: '/admin-panel/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin-panel/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin-panel/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${menuOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-brand">
          <ChefHat size={22} />
          <span>Glory Catering Service</span>
          <button type="button" className="admin-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="admin-nav">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
              <l.icon size={17} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" className="admin-nav-link" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> View Site
          </a>
          <button type="button" className="admin-nav-link" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className={`admin-backdrop${menuOpen ? ' show' : ''}`} onClick={() => setMenuOpen(false)} />

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div>
            <p className="admin-welcome">Admin Panel</p>
            <h1>Signed in as {user?.name}</h1>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

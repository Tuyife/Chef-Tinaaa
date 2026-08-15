import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChefHat, Home, UtensilsCrossed, Info, CalendarCheck, Mail,
  LogIn, LogOut, LayoutDashboard, UserRound, UserPlus,
} from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/services', label: 'Services', icon: UtensilsCrossed },
  { to: '/about', label: 'About', icon: Info },
  { to: '/booking', label: 'Book a Chef', icon: CalendarCheck },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ind, setInd] = useState({ left: 0, width: 0, ready: false });
  const linksRef = useRef({});
  const headerRef = useRef(null);

  const isActive = (l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to));

  const measure = () => {
    const l = NAV_LINKS.find(isActive);
    const el = l && linksRef.current[l.to];
    if (el && el.offsetParent) setInd({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="glass-nav-inner">
        <Link to="/" className="brand" onClick={close} aria-label="Glory Catering Service home">
          <span className="brand-mark">
            <ChefHat size={20} aria-hidden="true" />
          </span>
          <span className="brand-name">Glory Catering Service</span>
        </Link>

        <nav className="glass-nav-links" aria-label="Primary">
          <span
            className="glass-nav-indicator"
            aria-hidden="true"
            style={{ left: ind.left, width: ind.width, opacity: ind.ready ? 1 : 0 }}
          />
          {NAV_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                ref={(el) => {
                  linksRef.current[l.to] = el;
                }}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={close}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="glass-nav-actions">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="nav-account" onClick={close}>
              <UserRound size={17} aria-hidden="true" />
              <span>Account</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-account" onClick={close}>
              <LogIn size={17} aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-nav-panel">
          {NAV_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-panel-link ${isActive ? 'active' : ''}`}
                onClick={close}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{l.label}</span>
              </NavLink>
            );
          })}
          <div className="glass-nav-panel-foot">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-panel-action" onClick={close}>
                  <LayoutDashboard size={17} aria-hidden="true" /> My Dashboard
                </Link>
                <button type="button" className="nav-panel-action" onClick={handleLogout}>
                  <LogOut size={17} aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-panel-action" onClick={close}>
                  <LogIn size={17} aria-hidden="true" /> Sign In
                </Link>
                <Link to="/signup" className="nav-panel-action" onClick={close}>
                  <UserPlus size={17} aria-hidden="true" /> Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { Fragment, useEffect, useState } from 'react';
import { Search, Check, X, RefreshCw, Eye, CircleDollarSign } from 'lucide-react';
import { StatusBadge } from '../../components/UI.jsx';
import ServiceDetails from '../../components/booking/ServiceDetails.jsx';
import { api, formatDate, formatMoney } from '../../lib/api.js';

const FILTERS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [expanded, setExpanded] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (q) params.set('q', q);
    api(`/bookings?${params}`)
      .then((d) => setBookings(d.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (q) params.set('q', q);
    api(`/bookings?${params}`)
      .then((d) => {
        if (!cancelled) setBookings(d.bookings);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, q]);

  const setStatus = async (id, status) => {
    setWorking(id);
    try {
      await api(`/bookings/${id}`, { method: 'PUT', body: { status } });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setWorking('');
    }
  };

  const togglePaid = async (b) => {
    setWorking(b._id);
    try {
      await api(`/bookings/${b._id}`, {
        method: 'PUT',
        body: { paymentStatus: b.paymentStatus === 'successful' ? 'pending' : 'successful' },
      });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setWorking('');
    }
  };

  return (
    <>
      <div className="admin-toolbar">        <div className="tabs">
          {FILTERS.map((f) => (
            <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setQ(query)}
            placeholder="Search by service or location..."
          />
        </div>
      </div>

      <div className="card admin-panel-card">
        {loading ? (
          <div className="route-loader"><span className="spinner-dot" /></div>
        ) : bookings.length === 0 ? (
          <p className="empty-inline">No bookings found.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Service</th><th>Event</th><th>Location</th><th>Guests</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <BookingRow key={b._id} b={b} working={working} expanded={expanded}
                    setExpanded={setExpanded} setStatus={setStatus} togglePaid={togglePaid} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function BookingRow({ b, working, expanded, setExpanded, setStatus, togglePaid }) {
  const isOpen = expanded === b._id;
  const name = b.customerName || b.customer?.name || '—';
  const phone = b.customerPhone || b.customer?.phone || '';

  return (
    <Fragment>
      <tr className={isOpen ? 'detail-open' : ''}>
        <td>
          <strong>{name}</strong>
          <small>{phone}</small>
        </td>
        <td>{b.serviceName || b.service?.name}</td>
        <td>{formatDate(b.eventDate)} {b.eventTime}</td>
        <td>{b.location}</td>
        <td>{b.guests ?? '—'}</td>
        <td>{formatMoney(b.totalAmount)}</td>
        <td>
          <StatusBadge status={b.status} />
          <div className="sub-badge"><StatusBadge status={b.paymentStatus} /></div>
        </td>
        <td>
          <div className="row-actions">
            <button className="icon-btn" title="View details" onClick={() => setExpanded(isOpen ? '' : b._id)}>
              <Eye size={15} />
            </button>
            <button className="icon-btn ok" title="Confirm" disabled={working === b._id || b.status === 'confirmed'}
              onClick={() => setStatus(b._id, 'confirmed')}><Check size={15} /></button>
            <button className="icon-btn danger" title="Cancel" disabled={working === b._id || b.status === 'cancelled'}
              onClick={() => setStatus(b._id, 'cancelled')}><X size={15} /></button>
            <button className="icon-btn" title="Mark completed" disabled={working === b._id || b.status === 'completed'}
              onClick={() => setStatus(b._id, 'completed')}><RefreshCw size={15} /></button>
            <button className="icon-btn" title={b.paymentStatus === 'successful' ? 'Mark as unpaid' : 'Mark as paid'}
              disabled={working === b._id} onClick={() => togglePaid(b)}><CircleDollarSign size={15} /></button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="booking-detail-row">
          <td colSpan={8}>
            <div className="booking-detail-panel">
              <ServiceDetails booking={b} />
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

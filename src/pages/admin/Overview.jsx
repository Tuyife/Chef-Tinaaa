import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Users,
  Wallet,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { StatusBadge } from '../../components/UI.jsx';
import { api, formatDate, formatMoney } from '../../lib/api.js';

const METRIC_ICONS = {
  totalBookings: CalendarDays,
  pending: Clock3,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  totalCustomers: Users,
  totalRevenue: Wallet,
};

export default function Overview() {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api('/admin/overview'), api('/bookings')])
      .then(([ov, bk]) => {
        setData(ov);
        setRecent(bk.bookings.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="route-loader"><span className="spinner-dot" /></div>;
  if (!data) return <p className="form-error">Failed to load overview.</p>;

  const metrics = [
    { key: 'totalBookings', label: 'Total Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'totalCustomers', label: 'Customers' },
    { key: 'totalRevenue', label: 'Revenue' },
  ];

  const maxActivity = Math.max(1, ...data.activity.map((a) => a.count));
  const chartHeight = 160;

  return (
    <>
      <div className="admin-metrics">
        {metrics.map((m) => {
          const Icon = METRIC_ICONS[m.key] || TrendingUp;
          const value = m.key === 'totalRevenue' ? formatMoney(data.stats[m.key]) : data.stats[m.key];
          return (
            <div className="card admin-metric" key={m.key}>
              <span className="card-icon small"><Icon size={18} /></span>
              <div>
                <strong>{value}</strong>
                <span>{m.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-grid">
        <div className="card admin-panel-card">
          <h3 className="panel-title"><TrendingUp size={18} /> Booking Activity (14 days)</h3>
          <div className="chart-bars">
            {data.activity.map((a) => (
              <div className="chart-col" key={a._id} title={`${a.count} bookings`}>
                <span className="chart-bar" style={{ height: `${(a.count / maxActivity) * chartHeight}px` }} />
                <span className="chart-label">{new Date(a._id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
              </div>
            ))}
            {data.activity.length === 0 && <p className="empty-inline">No bookings in the last 14 days.</p>}
          </div>
        </div>

        <div className="card admin-panel-card">
          <h3 className="panel-title"><Wallet size={18} /> Revenue by Month</h3>
          <div className="revenue-list">
            {data.revenue.length === 0 && <p className="empty-inline">No successful payments yet.</p>}
            {data.revenue.slice(-6).reverse().map((r) => (
              <div className="revenue-row" key={r._id}>
                <span>{new Date(`${r._id}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                <strong>{formatMoney(r.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card admin-panel-card">
        <div className="panel-head-row">
          <h3 className="panel-title"><CalendarDays size={18} /> Recent Bookings</h3>
          <Link to="/admin-panel/bookings" className="btn btn--outline btn--sm">View All</Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty-inline">No bookings yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Service</th><th>Date</th><th>Guests</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b._id}>
                    <td>{b.customer?.name || '—'}</td>
                    <td>{b.serviceName || b.service?.name}</td>
                    <td>{formatDate(b.eventDate)}</td>
                    <td>{b.guests}</td>
                    <td>{formatMoney(b.totalAmount)}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card admin-panel-card">
        <div className="panel-head-row">
          <h3 className="panel-title"><MessageSquare size={18} /> Popular Services</h3>
        </div>
        <div className="popular-list">
          {data.popularity.length === 0 && <p className="empty-inline">No data yet.</p>}
          {data.popularity.map((p, i) => (
            <div className="popular-row" key={p._id}>
              <span className="popular-rank">{i + 1}</span>
              <span className="popular-name">{p._id}</span>
              <strong>{p.count} bookings</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

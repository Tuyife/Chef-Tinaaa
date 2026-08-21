import { useEffect, useState } from 'react';
import { Search, Ban, UserCheck, Settings } from 'lucide-react';
import { api, formatDate } from '../../lib/api.js';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    api(`/customers?${params}`)
      .then((d) => setCustomers(d.customers))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    api(`/customers?${params}`)
      .then((d) => {
        if (!cancelled) setCustomers(d.customers);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  const toggle = async (c) => {
    setWorking(c.id);
    try {
      await api(`/customers/${c.id}`, { method: 'PUT', body: { active: !c.active } });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setWorking('');
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setQ(query)} placeholder="Search by name, email or phone..." />
        </div>
      </div>

      <div className="card admin-panel-card">
        {loading ? (
          <div className="route-loader"><span className="spinner-dot" /></div>
        ) : customers.length === 0 ? (
          <p className="empty-inline">No customers found.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.accountNumber || '—'}</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <span className={`badge ${c.active ? 'badge--active' : 'badge--inactive'}`}>
                        {c.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn" title={c.active ? 'Disable account' : 'Enable account'}
                        disabled={working === c.id} onClick={() => toggle(c)}>
                        {c.active ? <Ban size={15} /> : <UserCheck size={15} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCheck, Inbox } from 'lucide-react';
import { StatusBadge } from '../../components/UI.jsx';
import { api, formatDateTime } from '../../lib/api.js';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const load = () => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    api(`/messages?${params}`)
      .then((d) => setMessages(d.messages))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    api(`/messages?${params}`)
      .then((d) => {
        if (!cancelled) setMessages(d.messages);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const setStatus = async (id, status) => {
    try {
      await api(`/messages/${id}`, { method: 'PUT', body: { status } });
      if (active?._id === id) setActive({ ...active, status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api(`/messages/${id}`, { method: 'DELETE' });
      setActive(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const unread = messages.filter((m) => m.status === 'unread').length;

  return (
    <>
      <div className="admin-toolbar">
        <div className="tabs">
          {['all', 'unread', 'read', 'resolved'].map((f) => (
            <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unread > 0 && <span className="tab-count">{unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-grid admin-grid--messages">
        <div className="card admin-panel-card">
          {loading ? (
            <div className="route-loader"><span className="spinner-dot" /></div>
          ) : messages.length === 0 ? (
            <p className="empty-inline"><Inbox size={20} /> No messages found.</p>
          ) : (
            <div className="msg-list">
              {messages.map((m) => (
                <button type="button" key={m._id} className={`msg-row ${active?._id === m._id ? 'active' : ''} ${m.status === 'unread' ? 'unread' : ''}`}
                  onClick={() => setActive(m)}>
                  <div className="msg-row-head">
                    <strong>{m.name}</strong>
                    <span>{formatDateTime(m.createdAt)}</span>
                  </div>
                  <p>{m.subject || 'No subject'}</p>
                  <span className="badge badge--small"><StatusBadge status={m.status} /></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card admin-panel-card">
          {active ? (
            <div className="msg-detail">
              <div className="msg-detail-head">
                <h3>{active.subject || 'No subject'}</h3>
                <StatusBadge status={active.status} />
              </div>
              <div className="msg-detail-meta">
                <span><Mail size={14} /> {active.email}</span>
                {active.phone && <span><Phone size={14} /> {active.phone}</span>}
                <span className="msg-date">{formatDateTime(active.createdAt)}</span>
              </div>
              <p className="msg-body">{active.message}</p>
              <div className="msg-actions">
                <a href={`mailto:${active.email}`} className="btn btn--primary btn--sm">Reply by Email</a>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setStatus(active._id, 'resolved')}>
                  <CheckCheck size={15} /> Mark Resolved
                </button>
                <button type="button" className="btn btn--ghost-light btn--sm danger-text" onClick={() => remove(active._id)}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="msg-empty"><Inbox size={32} /><p>Select a message to view it.</p></div>
          )}
        </div>
      </div>
    </>
  );
}

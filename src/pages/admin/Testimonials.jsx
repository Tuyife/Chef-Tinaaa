import { useEffect, useState } from 'react';
import { Star, Plus, Pencil, Trash2, X } from 'lucide-react';
import { api, formatDate } from '../../lib/api.js';

const EMPTY = { customerName: '', service: '', rating: 5, message: '' };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api('/testimonials/all')
      .then((d) => setItems(d.testimonials))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    api('/testimonials/all')
      .then((d) => {
        if (!cancelled) setItems(d.testimonials);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const open = (t) => {
    setEditing(t || null);
    setForm(t
      ? { customerName: t.customerName, service: t.service || '', rating: t.rating, message: t.message }
      : EMPTY);
    setError('');
  };

  const close = () => {
    setEditing(undefined);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api(`/testimonials/${editing._id}`, { method: 'PUT', body: form });
      else await api('/testimonials', { method: 'POST', body: form });
      close();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api(`/testimonials/${t._id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const togglePublished = async (t) => {
    try {
      await api(`/testimonials/${t._id}`, { method: 'PUT', body: { published: !t.published } });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <div className="admin-toolbar">
        <h3 className="panel-title">Testimonials</h3>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => open(null)}><Plus size={15} /> Add Testimonial</button>
      </div>

      {editing !== undefined && (
        <form className="card admin-panel-card service-form" onSubmit={submit}>
          <div className="panel-head-row">
            <h3 className="panel-title">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button type="button" className="icon-btn" onClick={close} title="Close"><X size={15} /></button>
          </div>
          <div className="field field--row">
            <div className="field">
              <label className="label">Customer Name <span className="req">*</span></label>
              <input className="input" value={form.customerName} required onChange={set('customerName')} placeholder="e.g. Adaeze Okafor" />
            </div>
            <div className="field">
              <label className="label">Service</label>
              <input className="input" value={form.service} onChange={set('service')} placeholder="e.g. Private Chef" />
            </div>
          </div>
          <div className="field">
            <label className="label">Rating</label>
            <select className="input" value={form.rating} onChange={set('rating')}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Message <span className="req">*</span></label>
            <textarea className="input" rows="4" value={form.message} required onChange={set('message')} placeholder="What did the client say?" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </form>
      )}

      <div className="card admin-panel-card">
        {loading ? (
          <div className="route-loader"><span className="spinner-dot" /></div>
        ) : items.length === 0 ? (
          <p className="empty-inline">No testimonials yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Service</th><th>Rating</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t._id}>
                    <td><strong>{t.customerName}</strong></td>
                    <td>{t.service || '—'}</td>
                    <td>
                      <span className="stars">
                        {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                      </span>
                    </td>
                    <td className="cell-truncate">{t.message}</td>
                    <td>{formatDate(t.createdAt)}</td>
                    <td><span className={`badge ${t.published ? 'badge--active' : 'badge--inactive'}`}>{t.published ? 'Published' : 'Hidden'}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title={t.published ? 'Hide' : 'Publish'} onClick={() => togglePublished(t)}>
                          {t.published ? <X size={15} /> : <Plus size={15} />}
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => open(t)}><Pencil size={15} /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => remove(t)}><Trash2 size={15} /></button>
                      </div>
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

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api, formatMoney } from '../../lib/api.js';
import { CUISINES } from '../../lib/bookingServices.js';

const EMPTY = { name: '', description: '', image: '', price: '', slug: '', menu: [] };

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api('/services?all=true')
      .then((d) => setServices(d.services))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    api('/services?all=true')
      .then((d) => {
        if (!cancelled) setServices(d.services);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description,
      image: s.image || '',
      price: s.price,
      slug: s.slug || '',
      menu: (s.menu || []).map((m) => ({ name: m.name, price: m.price, cuisine: m.cuisine || '', image: m.image || '' })),
    });
    setError('');
  };

  const updateMenu = (i, key, value) => {
    const menu = form.menu.map((m, idx) => (idx === i ? { ...m, [key]: value } : m));
    setForm({ ...form, menu });
  };

  const addMenu = () => setForm({ ...form, menu: [...form.menu, { name: '', price: '', cuisine: '', image: '' }] });

  const removeMenu = (i) => setForm({ ...form, menu: form.menu.filter((_, idx) => idx !== i) });

  const close = () => {
    setEditing(undefined);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api(`/services/${editing._id}`, { method: 'PUT', body: form });
      } else {
        await api('/services', { method: 'POST', body: form });
      }
      close();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try {
      await api(`/services/${s._id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <div className="admin-toolbar">
        <h3 className="panel-title">Manage Services</h3>
        <button type="button" className="btn btn--primary btn--sm" onClick={openNew}><Plus size={15} /> Add Service</button>
      </div>

      {editing !== undefined && (
        <form className="card admin-panel-card service-form" onSubmit={submit}>
          <div className="panel-head-row">
            <h3 className="panel-title">{editing ? 'Edit Service' : 'New Service'}</h3>
            <button type="button" className="icon-btn" onClick={close} title="Close"><X size={15} /></button>
          </div>
              <div className="field">
                <label className="label">Name <span className="req">*</span></label>
                <input className="input" value={form.name} required onChange={set('name')} placeholder="e.g. Private Chef" />
              </div>
              <div className="field">
                <label className="label">Description <span className="req">*</span></label>
                <textarea className="input" rows="3" value={form.description} required onChange={set('description')} placeholder="What does this service include?" />
              </div>
              <div className="field field--row">
                <div className="field">
                  <label className="label">Image Path</label>
                  <input className="input" value={form.image} onChange={set('image')} placeholder="/images/example.jpg" />
                </div>
                <div className="field">
                  <label className="label">Starting Price (NGN)</label>
                  <input className="input" type="number" min="0" value={form.price} onChange={set('price')} placeholder="e.g. 120000" />
                </div>
              </div>
              <div className="field">
                <label className="label">Key (slug)</label>
                <input className="input" value={form.slug} onChange={set('slug')} placeholder="e.g. food-delivery" />
                <span className="field-hint">Use "food-delivery" to enable the per-meal menu editor below.</span>
              </div>
              {form.slug === 'food-delivery' && (
                <div className="field">
                  <span className="label">Food Delivery Menu</span>
                  <div className="menu-editor">
                    {form.menu.map((m, i) => (
                      <div className="menu-editor-row" key={i}>
                        <input className="input" value={m.name} placeholder="Meal name" onChange={(e) => updateMenu(i, 'name', e.target.value)} />
                        <select className="input" value={m.cuisine} onChange={(e) => updateMenu(i, 'cuisine', e.target.value)}>
                          <option value="">All cuisines</option>
                          {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input className="input" type="number" min="0" value={m.price} placeholder="Price (NGN)" onChange={(e) => updateMenu(i, 'price', e.target.value)} />
                        <input className="input" value={m.image} placeholder="Image URL" onChange={(e) => updateMenu(i, 'image', e.target.value)} />
                        <button type="button" className="icon-btn danger" title="Remove meal" onClick={() => removeMenu(i)}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn--outline btn--sm" onClick={addMenu}><Plus size={14} /> Add Meal</button>
                </div>
              )}
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
              </button>
            </form>
      )}

      <div className="card admin-panel-card">
        {loading ? (
          <div className="route-loader"><span className="spinner-dot" /></div>
        ) : services.length === 0 ? (
          <p className="empty-inline">No services yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Service</th><th>Price</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="cell-service">
                        <img src={s.image || '/images/food-bowl.jpg'} alt="" />
                        <div><strong>{s.name}</strong><small>{s.description}</small></div>
                      </div>
                    </td>
                    <td>{formatMoney(s.price)}</td>
                    <td><span className={`badge ${s.active ? 'badge--active' : 'badge--inactive'}`}>{s.active ? 'Active' : 'Hidden'}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="Edit" onClick={() => openEdit(s)}><Pencil size={15} /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => remove(s)}><Trash2 size={15} /></button>
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

import { useEffect, useState } from 'react';
import { Wallet, ShieldCheck, CheckCircle2, Info, Edit } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function Settings() {
  const [payment, setPayment] = useState(null);
  const [editingAccount, setEditingAccount] = useState(false);
  const [account, setAccount] = useState({ bankName: '', accountName: '', accountNumber: '' });

  useEffect(() => {
    let cancelled = false;
    api('/payment-details')
      .then((d) => {
        if (!cancelled) setPayment(d);
        if (d.bankName) setAccount({ bankName: d.bankName, accountName: d.accountName, accountNumber: d.accountNumber });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const saveAccount = async () => {
    try {
      await api('/payment-details', { method: 'PUT', body: account });
      setEditingAccount(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="admin-grid">
        <div className="card admin-panel-card">
          <h3 className="panel-title"><Wallet size={18} /> Payments (Offline)</h3>
          <p className="settings-note">
            Payments are arranged offline — there is no online payment gateway on the site.
          </p>
          <div className="provider-list">
            <div className="provider-row">
              <div>
                <strong>How it works</strong>
                <span>Client submits a booking request, then you confirm and share payment details directly.</span>
              </div>
            </div>
            <div className="provider-row">
              <div>
                <strong>Tracking</strong>
                <span>When a payment is received, mark the booking as paid in the Bookings page.</span>
              </div>
            </div>
            <div className="provider-row">
              <div>
                <strong>Client sees</strong>
                <span>{payment?.enabled
                  ? `${[payment.bankName, payment.accountName, payment.accountNumber].filter(Boolean).join(' · ') || 'Custom instructions'} — shown after a booking is submitted.`
                  : 'Nothing yet — add details in server/.env to show a How to Pay section.'}</span>
              </div>
            </div>
            <span className={`badge ${payment?.enabled ? 'badge--active' : 'badge--inactive'}`}>
              {payment?.enabled ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <p className="settings-hint"><Info size={14} /> Paid bookings automatically count toward the revenue shown on the Overview page.</p>
        </div>

        <div className="card admin-panel-card">
          <h3 className="panel-title"><ShieldCheck size={18} /> Security</h3>
          {editingAccount ? (
            <form className="field" onSubmit={e => {
              e.preventDefault();
              saveAccount();
            }}>
              <div className="field">
                <label className="label">Bank Name</label>
                <input className="input" value={account.bankName} onChange={(e) => setAccount({ ...account, bankName: e.target.value })} placeholder="e.g. First Bank" />
              </div>
              <div className="field field--row">
                <div className="field">
                  <label className="label">Account Name</label>
                  <input className="input" value={account.accountName} onChange={(e) => setAccount({ ...account, accountName: e.target.value })} placeholder="e.g. Glory Catering Service" />
                </div>
                <div className="field">
                  <label className="label">Account Number</label>
                  <input className="input" type="text" value={account.accountNumber} onChange={(e) => setAccount({ ...account, accountNumber: e.target.value })} placeholder="e.g. 1234567890" />
                </div>
              </div>
              <div className="field">
                <button type="submit" className="btn btn--primary">Save Account Details</button>
                <button type="button" className="btn btn--outline" onClick={() => setEditingAccount(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="field">
              <label className="label">Admin Accounts</label>
              <p>{account.accountName || 'Not set'}</p>
              <p>{account.bankName ? 'Bank: ' + account.bankName : ''}</p>
              <p>{account.accountNumber ? 'Account: ' + account.accountNumber : ''}</p>
            </div>
            <button type="button" className="btn btn--primary" onClick={() => setEditingAccount(true)}><Edit size={16} /> Edit Account Details</button>
          )}
          <p className="settings-hint">Admin accounts are created only through the secure seed process. Public registration always creates customer accounts.</p>
          <p className="form-success"><CheckCircle2 size={16} /> Site is running in offline-payment mode.</p>
        </div>
      </div>
    </>
  );
}

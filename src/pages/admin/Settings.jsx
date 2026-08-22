import { useEffect, useState } from 'react';
import { Wallet, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function Settings() {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api('/payment-details')
      .then((d) => {
        if (!cancelled) setPayment(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
                  ? `ADEOYE CHRISTIANAH BOLUWATIFE 9054820983 Opay`
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
          <div className="field">
            <label className="label">Admin Accounts</label>
            <p>ADEOYE CHRISTIANAH BOLUWATIFE</p>
            <p>Phone: 9054820983</p>
            <p>Payment Method: Opay</p>
          </div>
          <p className="settings-hint">Admin accounts are created only through the secure seed process. Public registration always creates customer accounts.</p>
          <p className="form-success"><CheckCircle2 size={16} /> Site is running in offline-payment mode.</p>
        </div>
      </div>
    </>
  );
}

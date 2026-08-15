import { ArrowLeft, ArrowRight, UserRound, ClipboardCheck, Loader2 } from 'lucide-react';
import { SERVICE_ICONS, serviceLabel, summaryList } from '../../lib/bookingServices.js';

export default function BookingSummary({ slug, data, onBack, onSubmit, submitting, error }) {
  const Icon = SERVICE_ICONS[slug];
  const rows = summaryList(slug, data);
  const customer = data.customer || {};

  return (
    <div className="bw-summary">
      <div className="bw-summary-head">
        <span className="card-icon"><ClipboardCheck size={22} /></span>
        <div>
          <h3>Review Your Request</h3>
          <p>Take a moment to check everything is correct before submitting.</p>
        </div>
      </div>

      <div className="bw-summary-service">
        <span className="service-option-icon"><Icon size={20} /></span>
        <div>
          <span className="label">Service</span>
          <strong>{serviceLabel(slug)}</strong>
        </div>
      </div>

      <div className="bw-summary-customer">
        <div className="bw-summary-section-label"><UserRound size={15} /> Customer</div>
        <dl className="detail-grid">
          {customer.name && <div><dt>Full Name</dt><dd>{customer.name}</dd></div>}
          {customer.email && <div><dt>Email</dt><dd>{customer.email}</dd></div>}
          {customer.phone && <div><dt>Phone</dt><dd>{customer.phone}</dd></div>}
        </dl>
      </div>

      {rows.length > 0 && (
        <div className="bw-summary-details">
          <dl className="detail-grid">
            {rows.map((r) => (
              <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
            ))}
          </dl>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack} disabled={submitting}>
          <ArrowLeft size={16} /> Back to Edit
        </button>
        <button type="button" className="btn btn--primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? <><Loader2 size={16} className="spin" /> Submitting...</> : <>Submit Booking Request <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

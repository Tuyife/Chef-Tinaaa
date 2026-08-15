import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CalendarDays, ClipboardList, BadgeCheck, Landmark } from 'lucide-react';
import { serviceLabel } from '../../lib/bookingServices.js';
import { api, formatDate } from '../../lib/api.js';

export default function BookingConfirmation({ booking, user }) {
  const date = booking?.eventDate || booking?.serviceDetails?.preferredDate || booking?.serviceDetails?.eventDate || booking?.serviceDetails?.deliveryDate || booking?.serviceDetails?.startDate;
  const ref = booking?._id ? `CT-${String(booking._id).slice(-6).toUpperCase()}` : '';
  const service = booking?.serviceName || serviceLabel(booking?.serviceType);
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
    <div className="bw-confirm">
      <span className="bw-confirm-icon"><CheckCircle2 size={44} /></span>
      <h2>Booking Request Received</h2>
      <p className="bw-confirm-text">
        Thank you. Your request has been submitted to Glory Catering Service. We will review your details
        and contact you with confirmation and pricing.
      </p>
      <p className="bw-confirm-hint">
        Payment is arranged offline — no online payment is required. We will share payment details
        with you once your booking is confirmed.
      </p>

      <div className="bw-confirm-details">
        <div className="bw-confirm-row">
          <span className="card-icon small"><ClipboardList size={16} /></span>
          <div><span>Booking Reference</span><strong>{ref}</strong></div>
        </div>
        <div className="bw-confirm-row">
          <span className="card-icon small"><BadgeCheck size={16} /></span>
          <div><span>Service</span><strong>{service}</strong></div>
        </div>
        <div className="bw-confirm-row">
          <span className="card-icon small"><CalendarDays size={16} /></span>
          <div><span>Date</span><strong>{date ? formatDate(date) : '—'}</strong></div>
        </div>
        <div className="bw-confirm-row">
          <span className="card-icon small"><BadgeCheck size={16} /></span>
          <div><span>Status</span><strong><span className="badge badge--pending">Pending</span></strong></div>
        </div>
      </div>

      {payment?.enabled && (
        <div className="bw-confirm-details">
          <span className="bw-summary-section-label"><Landmark size={15} /> How to Pay</span>
          {payment.bankName && (
            <div className="bw-confirm-row">
              <span className="card-icon small"><Landmark size={16} /></span>
              <div><span>Bank</span><strong>{payment.bankName}</strong></div>
            </div>
          )}
          {payment.accountName && (
            <div className="bw-confirm-row">
              <span className="card-icon small"><Landmark size={16} /></span>
              <div><span>Account Name</span><strong>{payment.accountName}</strong></div>
            </div>
          )}
          {payment.accountNumber && (
            <div className="bw-confirm-row">
              <span className="card-icon small"><Landmark size={16} /></span>
              <div><span>Account Number</span><strong>{payment.accountNumber}</strong></div>
            </div>
          )}
          {payment.instructions && <p className="bw-confirm-hint">{payment.instructions}</p>}
        </div>
      )}

      <Link to={user && user.role === 'customer' ? '/dashboard' : '/signup'} className="btn btn--primary">
        View My Booking
      </Link>
      {!(user && user.role === 'customer') && (
        <p className="bw-confirm-hint">
          Create a free account to track this booking and see its status.
        </p>
      )}
    </div>
  );
}

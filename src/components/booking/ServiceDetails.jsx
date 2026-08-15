import { displayRows, SERVICE_ICONS, serviceLabel } from '../../lib/bookingServices.js';
import { formatDate } from '../../lib/api.js';

export default function ServiceDetails({ booking, showCustomer = true }) {
  const rows = displayRows(booking);
  const Icon = booking.serviceType ? SERVICE_ICONS[booking.serviceType] : null;
  const name = booking.serviceName || serviceLabel(booking.serviceType) || 'Booking';

  const contact = booking.customer || {};
  const cname = booking.customerName || contact.name;
  const email = booking.customerEmail || contact.email;
  const phone = booking.customerPhone || contact.phone;

  return (
    <div className="service-details">
      <div className="service-details-type">
        {Icon && (
          <span className="service-option-icon"><Icon size={16} aria-hidden="true" /></span>
        )}
        <div>
          <span className="label">Booking Type</span>
          <strong>{name}</strong>
        </div>
      </div>

      {showCustomer && (cname || email || phone) && (
        <div className="service-details-block">
          <span className="label">Customer</span>
          <p>{[cname, email, phone].filter(Boolean).join(' · ')}</p>
        </div>
      )}

      {rows.length > 0 ? (
        <dl className="detail-grid">
          {rows.map((r) => (
            <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
          ))}
        </dl>
      ) : (
        <dl className="detail-grid">
          {booking.eventDate && <div><dt>Date</dt><dd>{formatDate(booking.eventDate)}</dd></div>}
          {booking.eventTime && <div><dt>Time</dt><dd>{booking.eventTime}</dd></div>}
          {booking.location && <div><dt>Location</dt><dd>{booking.location}</dd></div>}
          {booking.guests && <div><dt>Guests</dt><dd>{booking.guests}</dd></div>}
          {booking.budget && <div><dt>Budget</dt><dd>{booking.budget}</dd></div>}
          {booking.message && <div><dt>Message</dt><dd>{booking.message}</dd></div>}
        </dl>
      )}
    </div>
  );
}

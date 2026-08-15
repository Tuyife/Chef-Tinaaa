import { Resend } from 'resend';

// Notification settings come from env (server/.env).
const API_KEY = process.env.RESEND_API_KEY || '';
const TO = process.env.ADMIN_NOTIFY_EMAIL || '';
const FROM = process.env.EMAIL_FROM || 'Glory Catering Service <onboarding@resend.dev>';

const resend = API_KEY ? new Resend(API_KEY) : null;

// Never throw from email code — booking creation must succeed with or without email.
const safeSend = async (payload) => {
  if (!resend || !TO) {
    console.log('[mailer] notifications disabled (set RESEND_API_KEY and ADMIN_NOTIFY_EMAIL)');
    return { skipped: true };
  }
  try {
    const { error } = await resend.emails.send(payload);
    if (error) console.error('[mailer] send failed:', error);
    return { error };
  } catch (err) {
    console.error('[mailer] send threw:', err.message);
    return { error: err };
  }
};

const esc = (v) =>
  String(v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const row = (label, value) =>
  value === undefined || value === null || String(value).trim() === ''
    ? ''
    : `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top;font-weight:600">${label}</td><td style="padding:6px 0;vertical-align:top">${esc(value)}</td></tr>`;

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Admin notification with the key booking info.
export async function sendBookingNotification(booking) {
  const details = booking.serviceDetails || {};
  const customer = details.customer || {};
  const rows = [
    row('Reference', booking.reference || booking._id),
    row('Service', booking.serviceName || 'Booking'),
    row('Customer', booking.customerName || customer.name),
    row('Email', booking.customerEmail || customer.email),
    row('Phone', booking.customerPhone || customer.phone),
    row('Date', formatDate(booking.eventDate)),
    row('Time', booking.eventTime),
    row('Location', booking.location),
    row('Guests', booking.guests),
    row('Budget', booking.budget),
    row('Total', booking.totalAmount ? `NGN ${Number(booking.totalAmount).toLocaleString('en-NG')}` : ''),
    row('Message', booking.message),
  ].join('');

  const extra = Object.entries(details)
    .filter(([k, v]) => k !== 'customer' && v !== '' && v != null)
    .map(([k, v]) =>
      row(
        k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
        Array.isArray(v) ? v.join(', ') : v,
      ),
    )
    .join('');

  return safeSend({
    from: FROM,
    to: TO,
    subject: `New booking request — ${booking.serviceName || 'Booking'}`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:auto;color:#1a1a1a">
        <h2 style="margin:0 0 4px">New Booking Request</h2>
        <p style="margin:0 0 20px;color:#666">A customer just submitted a request on Glory Catering Service.</p>
        <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #eee;border-radius:10px;overflow:hidden">
          <tbody>${rows}${extra}</tbody>
        </table>
        <p style="color:#999;font-size:12px;margin-top:20px">Sent from the Glory Catering Service booking system.</p>
      </div>`,
  });
}

import { Loader2 } from 'lucide-react';

export function Spinner({ size = 18 }) {
  return <Loader2 className="spin" size={size} aria-hidden="true" />;
}

export function Button({
  as: Tag = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  return (
    <Tag
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </Tag>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    successful: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded',
    unread: 'Unread',
    read: 'Read',
    resolved: 'Resolved',
  };
  return <span className={`badge badge--${status}`}>{map[status] || status}</span>;
}

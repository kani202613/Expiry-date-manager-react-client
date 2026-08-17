import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ExpiryBadge({ expiryDate, status }) {
  if (status === 'consumed') {
    return (
      <span className="badge badge-consumed">
        <CheckCircle size={13} />
        <span>Consumed</span>
      </span>
    );
  }

  if (status === 'discarded') {
    return (
      <span className="badge badge-discarded">
        <XCircle size={13} />
        <span>Discarded</span>
      </span>
    );
  }

  const expDate = new Date(expiryDate);
  const today = new Date();
  expDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return (
      <span className="badge badge-expired">
        <AlertTriangle size={13} />
        <span>Expired {daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`}</span>
      </span>
    );
  }

  if (diffDays === 0) {
    return (
      <span className="badge badge-urgent">
        <Clock size={13} />
        <span>Expires Today!</span>
      </span>
    );
  }

  if (diffDays === 1) {
    return (
      <span className="badge badge-warning">
        <Clock size={13} />
        <span>Expires Tomorrow</span>
      </span>
    );
  }

  if (diffDays <= 7) {
    return (
      <span className="badge badge-warning">
        <Clock size={13} />
        <span>Expires in {diffDays} days</span>
      </span>
    );
  }

  return (
    <span className="badge badge-safe">
      <CheckCircle size={13} />
      <span>{diffDays} days left</span>
    </span>
  );
}

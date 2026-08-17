import { AlertCircle, ArrowRight } from 'lucide-react';

export default function AlertBanner({ expiredCount, expiringSoonCount, onFilterClick }) {
  if (!expiredCount && !expiringSoonCount) return null;

  return (
    <div className={`alert-banner ${expiredCount > 0 ? 'banner-expired' : 'banner-warning'}`}>
      <div className="banner-content">
        <AlertCircle size={20} className="banner-icon" />
        <div>
          <strong>Attention Needed: </strong>
          {expiredCount > 0 ? (
            <span>You have {expiredCount} expired item{expiredCount > 1 ? 's' : ''} in your collection!</span>
          ) : (
            <span>You have {expiringSoonCount} item{expiringSoonCount > 1 ? 's' : ''} expiring in the next 7 days.</span>
          )}
        </div>
      </div>
      <button
        className="banner-action-btn"
        onClick={() => onFilterClick(expiredCount > 0 ? 'expired' : 'expiringSoon')}
      >
        <span>View Items</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

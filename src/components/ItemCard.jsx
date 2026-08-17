import { Edit2, Trash2, CheckCircle, Calendar, Hash, FileText } from 'lucide-react';
import ExpiryBadge from './ExpiryBadge';

export default function ItemCard({ item, onEdit, onDelete, onMarkStatus }) {
  const formattedExpiry = new Date(item.expiryDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedPurchase = item.purchaseDate
    ? new Date(item.purchaseDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <div className={`item-card status-${item.status}`}>
      <div className="card-top">
        <div className="category-pill">{item.category}</div>
        <ExpiryBadge expiryDate={item.expiryDate} status={item.status} />
      </div>

      <div className="card-body">
        <h3 className="item-name">{item.name}</h3>

        <div className="item-details">
          <div className="detail-row">
            <Calendar size={14} className="detail-icon" />
            <span>Expires: <strong>{formattedExpiry}</strong></span>
          </div>

          <div className="detail-row">
            <Hash size={14} className="detail-icon" />
            <span>Quantity: <strong>{item.quantity} {item.unit}</strong></span>
          </div>

          {formattedPurchase && (
            <div className="detail-row text-muted">
              <span>Bought: {formattedPurchase}</span>
            </div>
          )}

          {item.notes && (
            <div className="detail-notes">
              <FileText size={13} className="notes-icon" />
              <span>{item.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        {item.status === 'active' && (
          <button
            className="action-btn btn-consume"
            onClick={() => onMarkStatus(item._id, 'consumed')}
            title="Mark as Consumed"
          >
            <CheckCircle size={15} />
            <span>Consumed</span>
          </button>
        )}

        <button
          className="action-btn btn-edit"
          onClick={() => onEdit(item)}
          title="Edit Item"
        >
          <Edit2 size={15} />
        </button>

        <button
          className="action-btn btn-delete"
          onClick={() => onDelete(item._id)}
          title="Delete Item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

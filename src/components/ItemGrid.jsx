import ItemCard from './ItemCard';
import { PackageOpen, Plus } from 'lucide-react';

export default function ItemGrid({ items, loading, onEdit, onDelete, onMarkStatus, onOpenAddModal }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading your items...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <PackageOpen size={48} className="empty-icon" />
        </div>
        <h3>No items found</h3>
        <p>Your inventory is empty or no items match your current filter criteria.</p>
        <button className="btn-add-empty" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Add Your First Item</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid-container">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkStatus={onMarkStatus}
        />
      ))}
    </div>
  );
}

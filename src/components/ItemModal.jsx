import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CATEGORIES = ['Food', 'Medicine', 'Cosmetic', 'Grocery', 'Subscription', 'Utility', 'Other'];
const UNITS = ['pcs', 'kg', 'g', 'lbs', 'liters', 'ml', 'bottles', 'boxes', 'packs'];

export default function ItemModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    quantity: 1,
    unit: 'pcs',
    expiryDate: '',
    purchaseDate: '',
    notes: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        category: itemToEdit.category || 'Food',
        quantity: itemToEdit.quantity || 1,
        unit: itemToEdit.unit || 'pcs',
        expiryDate: itemToEdit.expiryDate ? itemToEdit.expiryDate.split('T')[0] : '',
        purchaseDate: itemToEdit.purchaseDate ? itemToEdit.purchaseDate.split('T')[0] : '',
        notes: itemToEdit.notes || '',
        status: itemToEdit.status || 'active'
      });
    } else {
      const defaultExp = new Date();
      defaultExp.setDate(defaultExp.getDate() + 7);
      setFormData({
        name: '',
        category: 'Food',
        quantity: 1,
        unit: 'pcs',
        expiryDate: defaultExp.toISOString().split('T')[0],
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
        status: 'active'
      });
    }
    setErrMessage('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrMessage('Please enter item name');
      return;
    }
    if (!formData.expiryDate) {
      setErrMessage('Please select expiry date');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(formData, itemToEdit?._id);
      setSubmitting(false);
      onClose();
    } catch (err) {
      setErrMessage(err.response?.data?.message || 'Failed to save item');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errMessage && <div className="modal-error">{errMessage}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Organic Milk, Amoxicillin, Sunscreen"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="consumed">Consumed</option>
                <option value="discarded">Discarded</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes / Storage Location</label>
            <textarea
              name="notes"
              placeholder="e.g., Kept in top fridge shelf, batch #204..."
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={submitting}>
              {submitting ? <span className="spinner"></span> : <><Check size={16} /> Save Item</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

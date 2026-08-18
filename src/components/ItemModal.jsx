import { useState, useEffect } from 'react';
import { X, Check, Barcode, QrCode } from 'lucide-react';

const CATEGORIES = ['Food', 'Medicine', 'Cosmetic', 'Grocery', 'Subscription', 'Utility', 'Other'];
const UNITS = ['pcs', 'kg', 'g', 'lbs', 'liters', 'ml', 'bottles', 'boxes', 'packs'];

export default function ItemModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    upcCode: '',
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
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        title: itemToEdit.title || itemToEdit.name || '',
        name: itemToEdit.name || itemToEdit.title || '',
        upcCode: itemToEdit.upcCode || '',
        category: itemToEdit.category || 'Food',
        quantity: itemToEdit.quantity !== undefined ? itemToEdit.quantity : 1,
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
        title: '',
        name: '',
        upcCode: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { name: value } : {}),
      ...(name === 'name' ? { title: value } : {})
    }));
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      // Generate sample UPC barcode code if empty
      const sampleUPC = '078742226490';
      setFormData((prev) => ({ ...prev, upcCode: sampleUPC }));
      setScanning(false);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productTitle = formData.title || formData.name;
    if (!productTitle.trim()) {
      setErrMessage('Please enter product title');
      return;
    }
    if (!formData.expiryDate) {
      setErrMessage('Please select expiry date');
      return;
    }

    setSubmitting(true);
    try {
      await onSave({ ...formData, title: productTitle, name: productTitle }, itemToEdit?._id);
      setSubmitting(false);
      onClose();
    } catch (err) {
      setErrMessage(err.response?.data?.message || 'Failed to save product');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{itemToEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errMessage && <div className="modal-error">{errMessage}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Title / Name *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Organic Milk, Amoxicillin, Sunscreen"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* UPC Barcode Section (Use-Case 2) */}
          <div className="form-group">
            <label>UPC Barcode Number (Scan or Manual Entry)</label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="upcCode"
                placeholder="e.g. 078742226490"
                value={formData.upcCode}
                onChange={handleChange}
                className="pr-24"
              />
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={scanning}
                className="absolute right-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 rounded-lg flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {scanning ? <span className="spinner"></span> : <><Barcode size={14} /> Scan UPC</>}
              </button>
            </div>
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
              <label>Quantity / Amount</label>
              <input
                type="number"
                name="quantity"
                min="0"
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
            <label>Notes / Details</label>
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
              {submitting ? <span className="spinner"></span> : <><Check size={16} /> Save Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

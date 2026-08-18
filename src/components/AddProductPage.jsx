import { useState } from 'react';
import Logo from './Logo';
import BarcodeScannerModal from './BarcodeScannerModal';
import api from '../services/api';
import {
  ArrowLeft,
  Camera,
  Barcode,
  Check,
  PackagePlus,
  AlertCircle
} from 'lucide-react';
import './AddProductPage.css';

const CATEGORIES = ['Food', 'Medicine', 'Cosmetic', 'Grocery', 'Subscription', 'Utility', 'Other'];
const UNITS = ['pcs', 'kg', 'g', 'lbs', 'liters', 'ml', 'bottles', 'boxes', 'packs'];

export default function AddProductPage({ onBackToDashboard }) {
  const defaultExp = new Date();
  defaultExp.setDate(defaultExp.getDate() + 7);

  const [formData, setFormData] = useState({
    title: '',
    upcCode: '',
    category: 'Food',
    quantity: 1,
    unit: 'pcs',
    expiryDate: defaultExp.toISOString().split('T')[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleBarcodeScanned = (code) => {
    setFormData((prev) => ({ ...prev, upcCode: code }));
    setSuccessMessage(`Barcode ${code} scanned successfully!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a product title or name');
      return;
    }
    if (!formData.expiryDate) {
      setErrorMessage('Please select a valid expiry date');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        title: formData.title.trim(),
        name: formData.title.trim(),
        upcCode: formData.upcCode.trim(),
        category: formData.category,
        quantity: Number(formData.quantity) || 1,
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        purchaseDate: formData.purchaseDate || null,
        notes: formData.notes.trim()
      };

      const res = await api.post('/api/items', payload);

      if (res.data.success) {
        setSuccessMessage('Product added successfully!');
        setTimeout(() => {
          onBackToDashboard();
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to add product');
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-wrapper">
      {/* Header */}
      <header className="add-product-header">
        <div className="add-product-header-container">
          <Logo size="medium" />

          <button onClick={onBackToDashboard} className="btn-back-dashboard">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="add-product-main">
        {/* Page Title */}
        <div className="add-product-title-row">
          <div className="add-product-title-icon">
            <PackagePlus size={24} />
          </div>
          <div className="add-product-title-text">
            <h1>Add New Product</h1>
            <p>Scan UPC barcode or manually log product details</p>
          </div>
        </div>

        {/* Banners */}
        {errorMessage && (
          <div className="add-product-alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="add-product-alert-success">
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="add-product-card">
          <form onSubmit={handleSubmit} className="add-product-form">
            {/* Product Title */}
            <div className="form-group-custom">
              <label className="form-label-custom">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Organic Whole Milk, Amoxicillin 500mg, Sunscreen Lotion"
                value={formData.title}
                onChange={handleChange}
                required
                className="add-product-input"
              />
            </div>

            {/* UPC Barcode Section */}
            <div className="form-group-custom">
              <label className="form-label-custom">
                <span>UPC Barcode Code (Manual or Camera Scan)</span>
                <span className="form-label-optional">Optional</span>
              </label>
              <div className="upc-input-row">
                <div className="upc-input-wrapper">
                  <Barcode size={18} className="upc-input-icon" />
                  <input
                    type="text"
                    name="upcCode"
                    placeholder="e.g. 078742226490"
                    value={formData.upcCode}
                    onChange={handleChange}
                    className="add-product-input add-product-input-padded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="btn-scan-camera"
                >
                  <Camera size={18} />
                  <span>Scan with Camera</span>
                </button>
              </div>
            </div>

            {/* Category & Quantity */}
            <div className="form-grid-2">
              <div className="form-group-custom">
                <label className="form-label-custom">
                  <span>Category</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="add-product-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">
                  Amount / Quantity
                </label>
                <div className="form-grid-amount">
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="add-product-input"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="add-product-select"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Expiry Date & Purchase Date */}
            <div className="form-grid-2">
              <div className="form-group-custom">
                <label className="form-label-custom">
                  <span>Expiry Date *</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  className="add-product-input"
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">
                  <span>Purchase Date</span>
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="add-product-input"
                />
              </div>
            </div>

            {/* Notes / Storage Info */}
            <div className="form-group-custom">
              <label className="form-label-custom">
                <span>Notes & Storage Location</span>
              </label>
              <textarea
                name="notes"
                placeholder="e.g. Kept in pantry shelf 2, prescription batch #904..."
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="add-product-textarea"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="add-product-actions">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="btn-cancel-product"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-save-product"
              >
                {submitting ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Save Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleBarcodeScanned}
      />
    </div>
  );
}

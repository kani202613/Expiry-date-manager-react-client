import { useState, useEffect } from 'react';
import Logo from './Logo';
import BarcodeScannerModal from './BarcodeScannerModal';
import api from '../services/api';
import {
  ArrowLeft,
  Camera,
  Barcode,
  Check,
  Edit3,
  AlertCircle,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import './AddProductPage.css';
import './EditProductPage.css';

const CATEGORIES = ['Food', 'Medicine', 'Cosmetic', 'Grocery', 'Subscription', 'Utility', 'Other'];
const UNITS = ['pcs', 'kg', 'g', 'lbs', 'liters', 'ml', 'bottles', 'boxes', 'packs'];

export default function EditProductPage({ productToEdit, onBackToDashboard }) {
  const [formData, setFormData] = useState({
    title: '',
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || productToEdit.name || '',
        upcCode: productToEdit.upcCode || '',
        category: productToEdit.category || 'Food',
        quantity: productToEdit.quantity !== undefined ? productToEdit.quantity : 1,
        unit: productToEdit.unit || 'pcs',
        expiryDate: productToEdit.expiryDate ? productToEdit.expiryDate.split('T')[0] : '',
        purchaseDate: productToEdit.purchaseDate ? productToEdit.purchaseDate.split('T')[0] : '',
        notes: productToEdit.notes || '',
        status: productToEdit.status || 'active'
      });
    }
  }, [productToEdit]);

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
    if (!productToEdit?._id) {
      setErrorMessage('No product selected for editing');
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
        notes: formData.notes.trim(),
        status: formData.status
      };

      const res = await api.put(`/api/items/${productToEdit._id}`, payload);

      if (res.data.success) {
        setSuccessMessage('Product updated successfully!');
        setTimeout(() => {
          onBackToDashboard();
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update product');
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-product-wrapper">
      {/* Header */}
      <header className="edit-product-header">
        <div className="edit-product-header-container">
          <Logo size="medium" />

          <button onClick={onBackToDashboard} className="btn-back-dashboard">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="edit-product-main">
        {/* Page Title */}
        <div className="edit-product-title-row">
          <div className="edit-product-title-icon">
            <Edit3 size={24} />
          </div>
          <div className="edit-product-title-text">
            <h1>Edit Product Details</h1>
            <p>Update product information, status, or scan new barcode</p>
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
        <div className="edit-product-card">
          <form onSubmit={handleSubmit} className="edit-product-form">
            {/* Product Title */}
            <div className="form-group-custom">
              <label className="form-label-custom">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Organic Whole Milk, Amoxicillin 500mg"
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

            {/* Category & Status */}
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
                  Product Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="add-product-select"
                >
                  <option value="active">Active (In Pantry/Storage)</option>
                  <option value="consumed">Consumed (Finished)</option>
                  <option value="discarded">Discarded (Expired/Wasted)</option>
                </select>
              </div>
            </div>

            {/* Quantity & Unit */}
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
                className="btn-update-product"
              >
                {submitting ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Update Product</span>
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

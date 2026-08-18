import { Search, X, Filter, ArrowUpDown, CalendarRange } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Medicine', 'Cosmetic', 'Grocery', 'Subscription', 'Utility', 'Other'];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  filterType,
  onFilterTypeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onToggleSortOrder
}) {
  return (
    <div className="filter-bar">
      {/* Search Input (Use-Case 4: Search by Title & UPC Code) */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search products by title, UPC barcode code, or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => onSearchChange('')}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        {/* Category Select */}
        <div className="category-select-wrapper">
          <Filter size={16} className="control-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="custom-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Date Filter Range Tabs (Use-Case 4: Filter by 1 Month, 3 Months, etc.) */}
        <div className="filter-tabs flex-wrap">
          <button
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('all')}
          >
            All Active
          </button>

          <button
            className={`filter-tab ${filterType === '1month' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('1month')}
            title="Products expiring within 1 month"
          >
            Within 1 Mo
          </button>

          <button
            className={`filter-tab ${filterType === '3months' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('3months')}
            title="Products expiring within 3 months"
          >
            Within 3 Mo
          </button>

          <button
            className={`filter-tab ${filterType === 'expiringSoon' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('expiringSoon')}
          >
            Within 7 Days
          </button>

          <button
            className={`filter-tab ${filterType === 'expired' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('expired')}
          >
            Expired
          </button>

          <button
            className={`filter-tab ${filterType === 'consumed' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('consumed')}
          >
            Consumed
          </button>
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="custom-select"
          >
            <option value="expiryDate">Sort by Expiry Date</option>
            <option value="title">Sort by Product Title</option>
            <option value="category">Sort by Category</option>
            <option value="createdAt">Sort by Date Added</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={onToggleSortOrder}
            title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

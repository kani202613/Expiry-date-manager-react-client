import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

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
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search items by name or notes..."
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

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('all')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filterType === 'expiringSoon' ? 'active' : ''}`}
            onClick={() => onFilterTypeChange('expiringSoon')}
          >
            Expiring Soon
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
            <option value="name">Sort by Name</option>
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

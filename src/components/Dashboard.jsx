import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import StatsOverview from './StatsOverview';
import AlertBanner from './AlertBanner';
import FilterBar from './FilterBar';
import ItemGrid from './ItemGrid';
import ItemModal from './ItemModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import api from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard({ onNavigateToAddProduct, onNavigateToEditProduct }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalActive: 0, expiringSoon: 0, expired: 0, consumed: 0 });
  const [loading, setLoading] = useState(true);

  // Pagination state (Use-Case 1: Max 20 products displayed per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('all'); // all, 1month, 3months, expiringSoon, expired, consumed
  const [sortBy, setSortBy] = useState('expiryDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Edit & Delete state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch summary stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/api/items/stats/summary');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch paginated items list (20 items max per page)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sortBy,
        order: sortOrder,
        page: currentPage,
        limit: 20
      };

      if (filterType === 'consumed') {
        params.status = 'consumed';
      } else if (filterType === '1month' || filterType === '3months' || filterType === 'expiringSoon' || filterType === 'expired') {
        params.filterType = filterType;
        params.status = 'active';
      } else {
        params.status = 'active';
      }

      const res = await api.get('/api/items', { params });
      if (res.data.success) {
        setItems(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, filterType, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, [fetchItems]);

  // Reset page to 1 when filters change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  // Handlers
  const handleOpenAdd = () => {
    if (onNavigateToAddProduct) {
      onNavigateToAddProduct();
    } else {
      setItemToEdit(null);
      setIsModalOpen(true);
    }
  };

  const handleOpenEdit = (product) => {
    if (onNavigateToEditProduct) {
      onNavigateToEditProduct(product);
    } else {
      setItemToEdit(product);
      setIsModalOpen(true);
    }
  };

  const handleOpenDelete = (product) => {
    setItemToDelete(product);
  };

  const handleConfirmDelete = async (productId) => {
    try {
      await api.delete(`/api/items/${productId}`);
      setItemToDelete(null);
      fetchStats();
      fetchItems();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleSaveItem = async (formData, itemId) => {
    if (itemId) {
      await api.put(`/api/items/${itemId}`, formData);
    } else {
      await api.post('/api/items', formData);
    }
    fetchStats();
    fetchItems();
  };

  const handleMarkStatus = async (itemId, newStatus) => {
    try {
      await api.put(`/api/items/${itemId}`, { status: newStatus });
      fetchStats();
      fetchItems();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="dashboard-layout">
      <Navbar onOpenAddModal={handleOpenAdd} onNavigateToAddProduct={onNavigateToAddProduct} />

      <main className="dashboard-content">
        <AlertBanner
          expiredCount={stats.expired}
          expiringSoonCount={stats.expiringSoon}
          onFilterClick={(type) => handleFilterTypeChange(type)}
        />

        <StatsOverview
          stats={stats}
          activeFilter={filterType}
          onSelectFilter={(type) => handleFilterTypeChange(type)}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          filterType={filterType}
          onFilterTypeChange={handleFilterTypeChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
        />

        <ItemGrid
          items={items}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onMarkStatus={handleMarkStatus}
          onOpenAddModal={handleOpenAdd}
        />

        {/* Pagination Controls (Use-Case 1: max 20 products displayed per page) */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800 text-sm text-slate-400">
            <span>
              Showing Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems} total products)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 flex items-center gap-1 text-xs font-semibold text-white cursor-pointer"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 flex items-center gap-1 text-xs font-semibold text-white cursor-pointer"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fallback Edit Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Inline Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemToDelete={itemToDelete}
      />
    </div>
  );
}

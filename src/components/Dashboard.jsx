import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import StatsOverview from './StatsOverview';
import AlertBanner from './AlertBanner';
import FilterBar from './FilterBar';
import ItemGrid from './ItemGrid';
import ItemModal from './ItemModal';
import api from '../services/api';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalActive: 0, expiringSoon: 0, expired: 0, consumed: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('all'); // all, expiringSoon, expired, consumed
  const [sortBy, setSortBy] = useState('expiryDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

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

  // Fetch items list
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sortBy,
        order: sortOrder
      };

      if (filterType === 'consumed') {
        params.status = 'consumed';
      } else if (filterType === 'expiringSoon' || filterType === 'expired') {
        params.filterType = filterType;
        params.status = 'active';
      } else {
        params.status = 'active';
      }

      const res = await api.get('/api/items', { params });
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, filterType, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, [fetchItems]);

  // Handlers
  const handleOpenAddModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
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

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/items/${itemId}`);
        fetchStats();
        fetchItems();
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
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
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="dashboard-content">
        <AlertBanner
          expiredCount={stats.expired}
          expiringSoonCount={stats.expiringSoon}
          onFilterClick={(type) => setFilterType(type)}
        />

        <StatsOverview
          stats={stats}
          activeFilter={filterType}
          onSelectFilter={(type) => setFilterType(type)}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
        />

        <ItemGrid
          items={items}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteItem}
          onMarkStatus={handleMarkStatus}
          onOpenAddModal={handleOpenAddModal}
        />
      </main>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}

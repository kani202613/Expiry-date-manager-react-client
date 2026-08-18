import { Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar({ onOpenAddModal, onNavigateToAddProduct }) {
  const { user, logout } = useAuth();

  const handleAddClick = () => {
    if (onNavigateToAddProduct) {
      onNavigateToAddProduct();
    } else if (onOpenAddModal) {
      onOpenAddModal();
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Logo size="medium" />
        </div>

        <div className="nav-right">
          <button className="btn-add" onClick={handleAddClick}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>

          <div className="user-profile">
            <div className="avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>

          <button className="btn-logout" onClick={logout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

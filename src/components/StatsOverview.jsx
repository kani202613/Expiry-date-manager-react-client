import { Package, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ stats, activeFilter, onSelectFilter }) {
  return (
    <div className="stats-grid">
      <div
        className={`stat-card card-total ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => onSelectFilter('all')}
      >
        <div className="stat-header">
          <span className="stat-title">Active Items</span>
          <div className="stat-icon-wrapper icon-total">
            <Package size={20} />
          </div>
        </div>
        <div className="stat-value">{stats?.totalActive || 0}</div>
        <span className="stat-subtitle">Currently tracked</span>
      </div>

      <div
        className={`stat-card card-warning ${activeFilter === 'expiringSoon' ? 'active' : ''}`}
        onClick={() => onSelectFilter('expiringSoon')}
      >
        <div className="stat-header">
          <span className="stat-title">Expiring Soon</span>
          <div className="stat-icon-wrapper icon-warning">
            <Clock size={20} />
          </div>
        </div>
        <div className="stat-value text-amber">{stats?.expiringSoon || 0}</div>
        <span className="stat-subtitle">Within 7 days</span>
      </div>

      <div
        className={`stat-card card-danger ${activeFilter === 'expired' ? 'active' : ''}`}
        onClick={() => onSelectFilter('expired')}
      >
        <div className="stat-header">
          <span className="stat-title">Expired Items</span>
          <div className="stat-icon-wrapper icon-danger">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-value text-red">{stats?.expired || 0}</div>
        <span className="stat-subtitle">Action required</span>
      </div>

      <div
        className={`stat-card card-success ${activeFilter === 'consumed' ? 'active' : ''}`}
        onClick={() => onSelectFilter('consumed')}
      >
        <div className="stat-header">
          <span className="stat-title">Consumed</span>
          <div className="stat-icon-wrapper icon-success">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="stat-value text-green">{stats?.consumed || 0}</div>
        <span className="stat-subtitle">Successfully used</span>
      </div>
    </div>
  );
}

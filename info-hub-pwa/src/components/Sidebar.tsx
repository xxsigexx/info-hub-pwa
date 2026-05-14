import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  CheckCircle2, 
  Tag, 
  Plus, 
  Briefcase, 
  User, 
  ShoppingBag,
  Box
} from 'lucide-react';
import { Category } from '../lib/store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  stats: { total: number; todo: number; inProgress: number; done: number };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onSelectCategory,
  stats
}) => {
  return (
    <>
      <aside className={`sidebar glass ${isOpen ? 'open' : ''}`}>
        <header className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><Box size={24} /></div>
            <span>Info-Hub</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="section-title">メニュー</span>
            <button 
              className={`nav-item ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => { onSelectCategory(null); onClose(); }}
            >
              <LayoutDashboard size={20} />
              <span>すべてのタスク</span>
              <span className="count">{stats.total}</span>
            </button>
          </div>

          <div className="nav-section">
            <span className="section-title">カテゴリー</span>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`nav-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => { onSelectCategory(cat.id); onClose(); }}
              >
                <div className="cat-dot" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
              </button>
            ))}
            <button className="nav-item add-cat">
              <Plus size={18} />
              <span>新規カテゴリー</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer glass">
          <div className="progress-container">
            <div className="progress-header">
              <span>達成率</span>
              <span>{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </div>
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <style>{`
        .sidebar {
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid var(--border-color);
        }

        .sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-lg);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-close {
          display: none;
          color: var(--text-secondary);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
          overflow-y: auto;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          padding-left: 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
        }

        .nav-item:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .nav-item.active {
          background: var(--primary);
          color: white;
        }

        .nav-item.active .count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .count {
          margin-left: auto;
          font-size: 0.75rem;
          background: var(--bg-primary);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .cat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .add-cat {
          font-size: 0.85rem;
          color: var(--primary);
          border: 1px dashed var(--primary);
          margin-top: 4px;
          justify-content: center;
        }

        .sidebar-footer {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
        }

        .progress-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-bar {
          height: 6px;
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
          transition: width 0.5s ease-out;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-close { display: block; }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 45;
            backdrop-filter: blur(4px);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;

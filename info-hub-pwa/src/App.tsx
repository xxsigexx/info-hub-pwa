import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useStore, Task, Category, TaskStatus } from './lib/store';
import TaskCard from './components/TaskCard';
import TaskDialog from './components/TaskDialog';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const { tasks, categories, addTask, updateTask, deleteTask } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || task.categoryId === filterCategory;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tasks, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  }, [tasks]);

  const handleAddTask = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        selectedCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        stats={stats}
      />
      
      <main className="main-content">
        <header className="header glass">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1>Info-Hub</h1>
          </div>
          
          <div className="search-bar glass">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="タスクを検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="content-scroll">
          <div className="content-wrapper container">
            <section className="stats-grid">
              <div className="stat-card glass animate-fade-in" style={{ '--delay': '0s' } as any}>
                <div className="stat-icon todo"><Clock size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">未着手</span>
                  <span className="stat-value">{stats.todo}</span>
                </div>
              </div>
              <div className="stat-card glass animate-fade-in" style={{ '--delay': '0.1s' } as any}>
                <div className="stat-icon progress"><AlertCircle size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">進行中</span>
                  <span className="stat-value">{stats.inProgress}</span>
                </div>
              </div>
              <div className="stat-card glass animate-fade-in" style={{ '--delay': '0.2s' } as any}>
                <div className="stat-icon done"><CheckCircle2 size={20} /></div>
                <div className="stat-info">
                  <span className="stat-label">完了</span>
                  <span className="stat-value">{stats.done}</span>
                </div>
              </div>
            </section>

            <section className="task-section">
              <div className="section-header">
                <h2>タスク一覧</h2>
                <div className="filter-group">
                  <select 
                    className="glass-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                  >
                    <option value="all">すべてのステータス</option>
                    <option value="todo">未着手</option>
                    <option value="in_progress">進行中</option>
                    <option value="done">完了</option>
                  </select>
                </div>
              </div>

              <div className="task-grid">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      category={categories.find(c => c.id === task.categoryId)}
                      onUpdateStatus={(status) => updateTask(task.id, { status })}
                      onEdit={() => openEditDialog(task)}
                      onDelete={() => deleteTask(task.id)}
                      style={{ '--delay': `${index * 0.05}s` } as any}
                    />
                  ))
                ) : (
                  <div className="empty-state glass">
                    <List size={48} />
                    <p>タスクが見つかりません</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <button 
          className="fab" 
          onClick={() => {
            setEditingTask(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus size={24} />
        </button>
      </main>

      <TaskDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddTask}
        categories={categories}
        task={editingTask}
      />

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: var(--bg-primary);
        }

        .header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-lg);
          z-index: 10;
          border-bottom: 1px solid var(--border-color);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .header-left h1 {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--primary);
        }

        .menu-toggle {
          display: none;
          color: var(--text-primary);
        }

        .search-bar {
          flex: 0 1 400px;
          height: 42px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-md);
          gap: var(--spacing-sm);
        }

        .search-bar input {
          background: none;
          border: none;
          flex: 1;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .search-icon {
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .icon-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-xl) 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.todo { background: rgba(100, 116, 139, 0.1); color: #64748b; }
        .stat-icon.progress { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .stat-icon.done { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .glass-select {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-md);
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          gap: var(--spacing-md);
          min-height: 300px;
        }

        .fab {
          position: absolute;
          bottom: var(--spacing-xl);
          right: var(--spacing-xl);
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(var(--primary-h), var(--primary-s), 50%, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          z-index: 20;
        }

        .fab:hover {
          transform: scale(1.1) rotate(90deg);
          background: var(--primary-hover);
        }

        @media (max-width: 768px) {
          .menu-toggle { display: block; }
          .search-bar { display: none; }
          .stats-grid { grid-template-columns: 1fr; }
          .header h1 { font-size: 1.1rem; }
          .task-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default App;

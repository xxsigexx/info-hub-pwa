import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Calendar, 
  AlertCircle,
  Pencil
} from 'lucide-react';
import { Task, Category, TaskStatus, TaskPriority } from '../lib/store';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onUpdateStatus: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const configs = {
    high: { color: 'var(--danger)', label: '高' },
    medium: { color: 'var(--warning)', label: '中' },
    low: { color: 'var(--success)', label: '低' },
  };
  const config = configs[priority];
  
  return (
    <span className="priority-badge" style={{ backgroundColor: config.color + '20', color: config.color }}>
      {config.label}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, category, onUpdateStatus, onEdit, onDelete, style }) => {
  const isDone = task.status === 'done';
  const isExpired = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <div className={`task-card glass animate-fade-in ${isDone ? 'done' : ''}`} style={style} onClick={onEdit}>
      <div className="card-header">
        <button 
          className="status-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(isDone ? 'todo' : 'done');
          }}
        >
          {isDone ? (
            <CheckCircle2 size={22} className="icon-done" />
          ) : (
            <Circle size={22} className="icon-todo" />
          )}
        </button>
        
        <div className="card-title-group">
          <h3 className={isDone ? 'line-through' : ''}>{task.title}</h3>
          {category && (
            <span className="category-tag" style={{ borderLeftColor: category.color }}>
              {category.name}
            </span>
          )}
        </div>

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className="action-btn" onClick={onDelete}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="card-footer">
        <div className="footer-left">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <div className={`due-date ${isExpired ? 'expired' : ''}`}>
              <Calendar size={14} />
              <span>{format(new Date(task.dueDate), 'MM/dd', { locale: ja })}</span>
            </div>
          )}
        </div>
        
        <div className="status-badge">
          {task.status === 'in_progress' && <span className="badge-progress">進行中</span>}
          {task.status === 'todo' && <span className="badge-todo">未着手</span>}
        </div>
      </div>

      <style>{`
        .task-card {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          transition: var(--transition);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .task-card.done {
          opacity: 0.6;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
        }

        .status-toggle {
          color: var(--text-secondary);
          padding-top: 2px;
          transition: var(--transition);
        }

        .status-toggle:hover {
          color: var(--primary);
          transform: scale(1.1);
        }

        .icon-done { color: var(--success); }

        .card-title-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-title-group h3 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .line-through {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .category-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding-left: 6px;
          border-left: 2px solid #ccc;
        }

        .task-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-left: 30px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-sm);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .priority-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .due-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .due-date.expired {
          color: var(--danger);
          font-weight: 600;
        }

        .status-badge {
          font-size: 0.7rem;
        }

        .badge-progress { color: var(--warning); font-weight: 600; }
        .badge-todo { color: var(--text-secondary); }

        .card-actions {
          opacity: 0;
          transition: var(--transition);
        }

        .task-card:hover .card-actions {
          opacity: 1;
        }

        .action-btn {
          color: var(--text-secondary);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .action-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }
      `}</style>
    </div>
  );
};

export default TaskCard;

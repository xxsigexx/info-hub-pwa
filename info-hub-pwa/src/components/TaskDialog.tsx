import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag, AlignLeft } from 'lucide-react';
import { Category, Task, TaskPriority, TaskStatus } from '../lib/store';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: Category[];
  task?: Task;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, onSubmit, categories, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [categoryId, setCategoryId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategoryId(task.categoryId || '');
      setDueDate(task.dueDate || '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
      setStatus('todo');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      priority,
      categoryId: categoryId || undefined,
      dueDate: dueDate || undefined,
      status,
    });
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{task ? 'タスクを編集' : '新しいタスク'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input 
              type="text" 
              className="title-input" 
              placeholder="タスクの名前..." 
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><Flag size={16} /> 優先度</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            <div className="form-group">
              <label><Tag size={16} /> カテゴリー</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">なし</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><Calendar size={16} /> 期限</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            {task && (
              <div className="form-group">
                <label>ステータス</label>
                <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                  <option value="todo">未着手</option>
                  <option value="in_progress">進行中</option>
                  <option value="done">完了</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label><AlignLeft size={16} /> 詳細</label>
            <textarea 
              placeholder="メモや詳細を入力..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn-primary">
              {task ? '更新する' : '作成する'}
            </button>
          </footer>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--spacing-md);
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .close-btn {
          color: var(--text-secondary);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .title-input {
          width: 100%;
          background: none;
          border: none;
          border-bottom: 2px solid var(--border-color);
          font-size: 1.5rem;
          font-weight: 600;
          padding: var(--spacing-sm) 0;
          color: var(--text-primary);
          transition: var(--transition);
        }

        .title-input:focus {
          border-bottom-color: var(--primary);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .form-group select, .form-group input[type="date"], .form-group textarea {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .form-group select:focus, .form-group input:focus, .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          font-weight: 600;
          transition: var(--transition);
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .btn-secondary {
          color: var(--text-secondary);
          padding: 10px 20px;
          font-weight: 500;
        }

        @media (max-width: 500px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default TaskDialog;

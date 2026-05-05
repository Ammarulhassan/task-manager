'use client';
import { useState, FormEvent } from 'react';
import { TaskFormData } from '@/types';

interface Props {
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Partial<TaskFormData>;
  onCancel?: () => void;
}

export default function TaskForm({ onSubmit, initialData, onCancel }: Props) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate?.slice(0, 10) || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!initialData) setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Task title" value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })} required
        className={inputCls} />
      <textarea placeholder="Description (optional)" value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2}
        className={inputCls} />
      <div className="flex gap-3">
        <select value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
          className={`flex-1 ${inputCls}`}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <input type="date" value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className={`flex-1 ${inputCls}`} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20">
          {loading ? 'Saving...' : initialData?.title ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-5 py-2 rounded-lg transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

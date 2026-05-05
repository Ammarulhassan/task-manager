'use client';
import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

type Filter = 'all' | 'pending' | 'completed';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  };

  const handleCreate = async (data: TaskFormData) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const d = await res.json();
    setTasks([d.task, ...tasks]);
  };

  const handleUpdate = async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const d = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? d.task : t)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const filtered = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
  );

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>➕</span> New Task
        </h2>
        <TaskForm onSubmit={handleCreate} />
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}>
            {f} <span className="ml-1 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskItem key={task._id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

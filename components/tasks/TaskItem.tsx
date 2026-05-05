'use client';
import { useState } from 'react';
import { Task, TaskFormData } from '@/types';
import TaskForm from './TaskForm';

interface Props {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const priorityConfig = {
  low: { cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', label: '🟢 Low' },
  medium: { cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', label: '🟡 Medium' },
  high: { cls: 'bg-red-500/20 text-red-400 border border-red-500/30', label: '🔴 High' },
};

export default function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (data: TaskFormData) => {
    await onUpdate(task._id, data);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-slate-800 border border-indigo-500/50 p-4 rounded-2xl shadow-lg">
        <TaskForm onSubmit={handleUpdate} initialData={task} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 border p-4 rounded-2xl shadow-md flex items-start gap-3 transition-all hover:border-slate-600 ${
      task.completed ? 'opacity-50 border-slate-700' : 'border-slate-700'
    }`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onUpdate(task._id, { completed: !task.completed })}
        className="mt-1 w-4 h-4 cursor-pointer accent-indigo-500"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-slate-400 mt-1">{task.description}</p>
        )}
        <div className="flex gap-2 mt-2 flex-wrap items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].cls}`}>
            {priorityConfig[task.priority].label}
          </span>
          {task.dueDate && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

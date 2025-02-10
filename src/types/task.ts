export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
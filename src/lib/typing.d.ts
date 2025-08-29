export type TaskColumn = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
}

export interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTask: (task: CreateTaskInput) => void;
  updateTask: (id: string, updates: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newColumn: TaskColumn) => void;
  getTasksByColumn: (column: TaskColumn) => Task[];
  getFilteredTasks: () => Task[];
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<
  Omit<Task, "id" | "createdAt" | "updatedAt">
>;

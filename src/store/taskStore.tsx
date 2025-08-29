import { create } from "zustand";
import {
  Task,
  TaskColumn,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/lib/typing";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/tasks";

export interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  fetchTasks: () => Promise<void>;
  addTask: (taskInput: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newColumn: TaskColumn) => Promise<void>;

  getTasksByColumn: (column: TaskColumn) => Task[];
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  searchQuery: "",

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchTasks: async () => {
    const data = await getTasks();
    set({ tasks: data });
  },

  addTask: async (taskInput) => {
    const newTask = await createTask(taskInput);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: async (id, updates) => {
    const updated = await updateTask(id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTask: async (id) => {
    await deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  moveTask: async (id, newColumn) => {
    const updated = await updateTask(id, { column: newColumn });
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  getTasksByColumn: (column) => {
    const { tasks, searchQuery } = get();
    return tasks.filter((task) => {
      const matchesColumn = task.column === column;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesColumn && matchesSearch;
    });
  },

  getFilteredTasks: () => {
    const { tasks, searchQuery } = get();
    if (searchQuery === "") return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
}));

import { create } from "zustand";

interface TaskState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

"use client";

import { TaskStore } from "@/lib/typing";
import { useTaskStore } from "@/store/taskStore";
import { createContext, useContext, useRef, ReactNode } from "react";
import { useStore } from "zustand";

// Create context for the store
const TaskStoreContext = createContext<ReturnType<typeof useTaskStore> | null>(
  null
);

interface TaskStoreProviderProps {
  children: ReactNode;
}

const TaskStoreProvider = ({ children }: TaskStoreProviderProps) => {
  const storeRef = useRef<ReturnType<typeof useTaskStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = useTaskStore;
  }

  return (
    <TaskStoreContext.Provider value={storeRef.current}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export function useTaskStoreContext(): TaskStore {
  const store = useContext(TaskStoreContext);

  if (!store) {
    throw new Error(
      "useTaskStoreContext must be used within TaskStoreProvider"
    );
  }

  return useStore(store as unknown as typeof useTaskStore);
}

// Alternative hook that provides a selector for better performance
export function useTaskSelector<T>(selector: (state: TaskStore) => T): T {
  const store = useContext(TaskStoreContext);

  if (!store) {
    throw new Error("useTaskSelector must be used within TaskStoreProvider");
  }

  return useStore(store as unknown as typeof useTaskStore, selector);
}

export default TaskStoreProvider;

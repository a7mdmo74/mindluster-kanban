"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import { useStore } from "zustand";
import { useTaskStore } from "@/store/taskStore";

const TaskStoreContext = createContext<typeof useTaskStore | null>(null);

interface TaskStoreProviderProps {
  children: ReactNode;
}

const TaskStoreProvider = ({ children }: TaskStoreProviderProps) => {
  const storeRef = useRef<typeof useTaskStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = useTaskStore;
  }

  return (
    <TaskStoreContext.Provider value={storeRef.current}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export function useTaskStoreContext() {
  const store = useContext(TaskStoreContext);
  if (!store)
    throw new Error(
      "useTaskStoreContext must be used within TaskStoreProvider"
    );
  return useStore(store);
}

export function useTaskSelector<T>(
  selector: (state: ReturnType<typeof useTaskStore>) => T
): T {
  const store = useContext(TaskStoreContext);
  if (!store)
    throw new Error("useTaskSelector must be used within TaskStoreProvider");
  return useStore(store, selector);
}

export default TaskStoreProvider;

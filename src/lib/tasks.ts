import axios from "axios";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/lib/typing";

const api = axios.create();

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get("/api/tasks");
  return res.data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await api.post("/api/tasks", {
    ...input,
    column: input.column ?? "backlog",
  });
  return res.data;
};

export const updateTask = async (
  id: string,
  updates: UpdateTaskInput
): Promise<Task> => {
  const res = await api.patch(`/api/tasks/${id}`, {
    ...updates,
  });
  return res.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/api/tasks/${id}`);
  return id;
};

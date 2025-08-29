import axios from "axios";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/lib/typing";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await api.post("/tasks", {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return res.data;
};

export const updateTask = async (
  id: string,
  updates: UpdateTaskInput
): Promise<Task> => {
  const res = await api.patch(`/tasks/${id}`, {
    ...updates,
    updatedAt: new Date(),
  });
  return res.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
};

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Task, TaskColumn } from "@/lib/typing";

import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultColumn: TaskColumn;
}

const TaskModal = ({
  isOpen,
  onClose,
  task,
  defaultColumn,
}: TaskModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  // React Query mutations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TaskColumn>(defaultColumn);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setColumn(task.column);
    } else {
      setTitle("");
      setDescription("");
      setColumn(defaultColumn);
    }
  }, [task, defaultColumn, isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (task) {
      // ✅ Update existing task
      updateTask.mutate(
        {
          id: task.id,
          updates: {
            title: title.trim(),
            description: description.trim(),
            column,
          },
        },
        {
          onSuccess: () => {
            enqueueSnackbar("Task updated successfully", {
              variant: "success",
            });
            onClose();
          },
        }
      );
    } else {
      // ✅ Create new task
      createTask.mutate(
        {
          title: title.trim(),
          description: description.trim(),
          column,
        },
        {
          onSuccess: () => {
            enqueueSnackbar("Task created successfully", {
              variant: "success",
            });
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <FormControl fullWidth>
            <InputLabel>Column</InputLabel>
            <Select
              value={column}
              label="Column"
              onChange={(e) => setColumn(e.target.value as TaskColumn)}
            >
              <MenuItem value="backlog">Backlog</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !title.trim() || createTask.isPending || updateTask.isPending
          }
        >
          {task ? "Update" : "Create"} Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;

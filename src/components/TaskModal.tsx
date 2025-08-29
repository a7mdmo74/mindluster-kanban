import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Task, TaskColumn } from "@/lib/typing";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultColumn: TaskColumn;
}

interface TaskFormInputs {
  title: string;
  description: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "At least 3 chars"),
  description: yup.string().required(),
});

const TaskModal = ({
  isOpen,
  onClose,
  task,
  defaultColumn,
}: TaskModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [task, reset, isOpen]);

  const onSubmit = (data: TaskFormInputs) => {
    if (task) {
      updateTask.mutate(
        {
          id: task.id,
          updates: { ...data, column: task.column },
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
      createTask.mutate(
        { ...data, column: defaultColumn },
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Description"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={
            isSubmitting || createTask.isPending || updateTask.isPending
          }
        >
          {task ? "Update" : "Create"} Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;

"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTaskStore } from "@/store/taskStore"; // Zustand for UI state
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Container,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Task, TaskColumn } from "@/lib/typing";

import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import TaskModal from "@/components/TaskModal";
import BoardColumn from "@/components/BoardCloumn";

const columns: { id: TaskColumn; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

const Board = () => {
  const { searchQuery, setSearchQuery } = useTaskStore();

  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<TaskColumn>("backlog");

  // ✅ Filter tasks based on column + search
  const getTasksByColumn = (column: TaskColumn) =>
    tasks.filter((task) => {
      const matchesColumn = task.column === column;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesColumn && matchesSearch;
    });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newColumn = destination.droppableId as TaskColumn;

    updateTask.mutate(
      { id: draggableId, updates: { column: newColumn } },
      {
        onSuccess: () =>
          enqueueSnackbar(`Task moved to ${newColumn.replace("-", " ")}`, {
            variant: "success",
          }),
      }
    );
  };

  const handleAddTask = (column: TaskColumn) => {
    setDefaultColumn(column);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Task deleted successfully", { variant: "success" }),
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Paper
        sx={{
          borderRadius: 0,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Kanban Board
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your tasks efficiently
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search */}
              <TextField
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Add Task Button */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleAddTask("backlog")}
              >
                Add Task
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Board */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              pb: 2,
              "&::-webkit-scrollbar": {
                height: 8,
              },
            }}
          >
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                title={column.title}
                column={column.id}
                tasks={getTasksByColumn(column.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </Box>
        </DragDropContext>
      </Container>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        defaultColumn={defaultColumn}
      />
    </Box>
  );
};

export default Board;

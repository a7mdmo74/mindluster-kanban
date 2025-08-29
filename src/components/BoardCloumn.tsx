import { Box, Typography, Paper, IconButton, Chip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Droppable } from "@hello-pangea/dnd";
import { Task, TaskColumn } from "@/lib/typing";
import TaskCard from "./TaskCard";
interface BoardColumnProps {
  title: string;
  column: TaskColumn;
  tasks: Task[];
  onAddTask: (column: TaskColumn) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const BoardColumn = ({
  title,
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) => {
  return (
    <Paper
      sx={{
        width: 320,
        minHeight: 600,
        backgroundColor: "background.paper",
        border: `2px solid ${"border"}`,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${"border"}` }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Chip
              label={tasks.length}
              size="small"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                color: "text.primary",
                fontSize: "0.75rem",
                height: 20,
              }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onAddTask(column)}
            sx={{
              color: "text.primary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              flexGrow: 1,
              p: 2,
              backgroundColor: snapshot.isDraggingOver
                ? "rgba(25, 118, 210, 0.08)"
                : "transparent",
              transition: "background-color 0.2s ease",
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No tasks yet
                </Typography>
                <IconButton
                  onClick={() => onAddTask(column)}
                  sx={{
                    color: "text.primary",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  <Add />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Add first task
                  </Typography>
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default BoardColumn;

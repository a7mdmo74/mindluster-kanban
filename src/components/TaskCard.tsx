import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/lib/typing";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  const getColumnChipColor = (column: string) => {
    switch (column) {
      case "backlog":
        return "default";
      case "in-progress":
        return "primary";
      case "review":
        return "secondary";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? "dragging" : ""}
        >
          <Card
            sx={{
              mb: 2,
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              "&:hover": {
                boxShadow: 3,
                "& .action-buttons": {
                  opacity: 1,
                },
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <CardContent sx={{ pb: 2, "&:last-child": { pb: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, flexGrow: 1, mr: 1 }}
                >
                  {task.title}
                </Typography>
                <Box
                  className="action-buttons"
                  sx={{ opacity: 0, transition: "opacity 0.2s" }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                    sx={{ p: 0.5, mr: 0.5 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    sx={{ p: 0.5 }}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: task.description ? 1 : 0,
                }}
              >
                <Chip
                  label={task.column.replace("-", " ")}
                  size="small"
                  color={getColumnChipColor(task.column)}
                  sx={{ fontSize: "0.7rem", height: 20 }}
                />
              </Box>

              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};
export default TaskCard;

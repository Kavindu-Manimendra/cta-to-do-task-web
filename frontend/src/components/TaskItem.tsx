import {Button, Card, CardContent, Typography, Stack, Box} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {Task} from "../features/tasks/taskTypes.ts";
import {markTask} from "../features/tasks/task-api.ts";
import { useSnackbar } from "notistack";

interface TaskItemProps {
    task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { mutate, isPending } = useMutation({
        mutationFn: () => markTask(task.id),
        onSuccess: () => {
            enqueueSnackbar("Task marked as done!", { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            enqueueSnackbar("Failed to mark task.", { variant: "error" });
        },
    });

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 4,
                transition: "all 0.2s ease-in-out",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
        >
            <CardContent sx={{ px: 3, py: 2 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {task.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {task.description || "No description provided"}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{
                            borderRadius: 4,
                            fontSize: "0.75rem",
                            textTransform: "none",
                            minWidth: "80px",
                        }}
                        disabled={isPending || task.completed}
                        onClick={() => mutate()}
                    >
                        {task.completed ? "Done" : isPending ? "Marking..." : "Done"}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TaskItem;

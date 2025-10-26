import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Stack, CircularProgress } from "@mui/material";
import TaskItem from "./TaskItem";
import type {Task} from "../features/tasks/taskTypes.ts";
import {getRecentTasks} from "../features/tasks/task-api.ts";

const TaskList = () => {
    const { data, isLoading, isError } = useQuery<Task[]>({
        queryKey: ["tasks"],
        queryFn: getRecentTasks,
    });

    if (isLoading)
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                <Typography>Loading tasks...</Typography>
                <CircularProgress size={24} sx={{ mt: 2 }} />
            </Paper>
        );

    if (isError)
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                <Typography color="error">Failed to load tasks.</Typography>
            </Paper>
        );

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, overflow: "auto" }}>
            <Stack spacing={2}>
                {data && data.length > 0 ? (
                    data.map((task) =>
                            <TaskItem key={task.id} task={task} />)
                ) : (
                    <Typography>No tasks available.</Typography>
                )}
            </Stack>
        </Paper>
    );
};

export default TaskList;

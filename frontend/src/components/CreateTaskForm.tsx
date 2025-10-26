import { useState } from "react";
import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createTask} from "../features/tasks/task-api.ts";
import { useSnackbar } from "notistack";

const CreateTaskForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { mutate, isPending } = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            enqueueSnackbar("Task created successfully!", { variant: "success" });
            setTitle("");
            setDescription("");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            enqueueSnackbar("Failed to create task. Please try again.", { variant: "error" });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            enqueueSnackbar("⚠️ Title is required.", { variant: "warning" });
            return;
        }
        mutate({ title, description });
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                overflow: "auto",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Add a Task
            </Typography>
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Title"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Description"
                    value={description}
                    multiline
                    maxRows={10}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{
                        borderRadius: 4,
                        fontSize: "1rem",
                        textTransform: "none",
                        minWidth: "80px",
                    }}
                >
                    {isPending ? "Adding..." : "Add"}
                </Button>
            </Box>
        </Paper>
    );
};

export default CreateTaskForm;

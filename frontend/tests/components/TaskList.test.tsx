import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "../../src/components/TaskList";
import {renderWithProviders} from "../../src/test-utils";
// import {getRecentTasks} from "../../src/features/tasks/task-api";

import * as taskApi from "../../src/features/tasks/task-api";
// import {vi} from "vitest";

vi.mock("../../src/api/taskApi");

describe("TaskList", () => {
    test("fetches and displays recent tasks", async () => {
        const mockGetRecentTasks = taskApi.getRecentTasks as unknown as vi.Mock;

        mockGetRecentTasks.mockResolvedValue([
            {
                id: 10,
                title: "Task 10",
                description: "sample",
                completed: false,
                createdAt: "2025-10-25T08:05:36.523836Z",
            },
        ]);
        renderWithProviders(<TaskList />);
        const taskTitle = await screen.findByText(/task 10/i);
        expect(taskTitle).toBeInTheDocument();
    });

    test("marks a task as done and shows toast", async () => {
        const mockGetRecentTasks = taskApi.getRecentTasks as unknown as vi.Mock;
        const mockMarkTask = taskApi.markTask as unknown as vi.Mock;

        mockGetRecentTasks.mockResolvedValue([
            {
                id: 11,
                title: "Task 11",
                description: "something",
                completed: false,
                createdAt: "2025-10-25T08:05:36.523836Z",
            },
        ]);

        mockMarkTask.mockResolvedValue({ message: "Task marked successfully" });

        renderWithProviders(<TaskList />);

        const button = await screen.findByRole("button", { name: /mark done/i });
        await userEvent.click(button);

        const success = await screen.findByText(/task marked successfully/i);
        expect(success).toBeInTheDocument();
    });
});


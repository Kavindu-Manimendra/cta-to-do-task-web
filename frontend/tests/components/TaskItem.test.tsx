import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../../src/components/TaskItem";
import {Task} from "../../src/features/tasks/taskTypes";
import {renderWithProviders} from "../../src/test-utils";

const sampleTask: Task = {
    id: 99,
    title: "Sample",
    description: "Sample desc",
    createdAt: new Date().toISOString(),
    completed: false,
};

describe("TaskItem", () => {
    test("renders title, description and mark button", () => {
        renderWithProviders(<TaskItem task={sampleTask} />);

        expect(screen.getByText("Sample")).toBeInTheDocument();
        expect(screen.getByText("Sample desc")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("button disabled when completed", () => {
        renderWithProviders(<TaskItem task={{ ...sampleTask, completed: true }} />);
        const btn = screen.getByRole("button");
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent(/done/i);
    });

    test("clicking mark calls API and shows success", async () => {
        // use the mock server handler: create a temporary route that resolves
        renderWithProviders(<TaskItem task={{ ...sampleTask, id: 4 }} />); // id 4 exists in mock
        const btn = screen.getByRole("button");
        await userEvent.click(btn);
        const msg = await screen.findByText(/task marked as done/i);
        expect(msg).toBeInTheDocument();
    });
});

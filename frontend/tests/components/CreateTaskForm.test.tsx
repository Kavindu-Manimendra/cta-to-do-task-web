import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateTaskForm from "../../src/components/CreateTaskForm";
import {renderWithProviders} from "../../src/test-utils";

describe("CreateTaskForm", () => {
    test("renders inputs and submits form - success shows success snackbar and clears inputs", async () => {
        renderWithProviders(<CreateTaskForm />);

        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
        const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
        const addButton = screen.getByRole("button", { name: /Add/i });

        await userEvent.type(titleInput, "Test Task");
        await userEvent.type(descInput, "a description");
        await userEvent.click(addButton);

        // wait for success snackbar to appear
        const success = await screen.findByText(/Task created successfully!/i);
        expect(success).toBeInTheDocument();

        // inputs cleared
        expect(titleInput.value).toBe("");
        expect(descInput.value).toBe("");
    });

    test("shows warning snackbar when title is empty", async () => {
        renderWithProviders(<CreateTaskForm />);

        const addButton = screen.getByRole("button", { name: /Add/i });
        await userEvent.click(addButton);

        const warn = await screen.findByText(/title.*required/i);
        expect(warn).toBeInTheDocument();
    });
});


// import { http } from 'msw';
// import {createTask, getRecentTasks, markTask} from "../../src/features/tasks/task-api";
// import {server} from "../../src/mocks/server";
//
// const API_BASE = "http://localhost:9090/api/v1/task";
//
// describe("taskApi", () => {
//     test("getRecentTasks returns array", async () => {
//         const tasks = await getRecentTasks();
//         expect(Array.isArray(tasks)).toBe(true);
//         expect(tasks.length).toBeGreaterThan(0);
//     });
//
//     test("createTask returns created task", async () => {
//         const t = await createTask({ title: "x", description: "y" });
//         expect(t).toHaveProperty("id");
//         expect(t.title).toBe("x");
//     });
//
//     test("markTask handles not found", async () => {
//         // override handler to return 404 for this test
//         server.use(
//             http.get(`${API_BASE}/mark-task/:id`, (req, res, ctx) => {
//                 return res(ctx.status(404), ctx.json({ message: "Task not found.", data: null }));
//             })
//         );
//
//         await expect(markTask(9999)).resolves.toBeDefined();
//     });
// });

import { describe, it, expect, vi, beforeEach } from "vitest";
import {createTask, getRecentTasks, markTask} from "../../src/features/tasks/task-api";

// Mock global fetch
(globalThis.fetch as any) = vi.fn();

describe("taskApi", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("getRecentTasks returns array", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: "1", title: "new task" }],
        } as Response);

        const tasks = await getRecentTasks();
        expect(Array.isArray(tasks)).toBe(true);
        expect(tasks[0].title).toBe("x");
    });

    it("createTask returns created task", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: "123", title: "x", description: "y" }),
        } as Response);

        const t = await createTask({ title: "x", description: "y" });
        expect(t).toHaveProperty("id");
        expect(t.title).toBe("x");
    });

    it("markTask handles not found", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            status: 404,
        } as Response);

        await expect(markTask(999)).rejects.toThrow();
    });
});

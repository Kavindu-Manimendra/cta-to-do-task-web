// import { http } from 'msw';
// import type {Task} from "../features/tasks/taskTypes.ts";
//
// const API_BASE = "http://localhost:9090/api/v1/task";
//
// const tasks: Task[] = [
//     { id: 4, title: "t4", description: "d4", createdAt: "2025-10-23T17:57:29.581131Z", completed: false },
//     { id: 5, title: "t5", description: "d5", createdAt: "2025-10-23T17:57:35.974472Z", completed: false },
//     { id: 6, title: "t6", description: "d6", createdAt: "2025-10-23T17:57:42.155285Z", completed: false },
//     { id: 7, title: "t7", description: "d7", createdAt: "2025-10-23T17:57:47.853550Z", completed: false },
//     { id: 10, title: "t10", description: "d10", createdAt: "2025-10-25T08:05:36.523836Z", completed: false },
// ];
//
// export const handlers = [
//     // get recent tasks
//     http.get(`${API_BASE}/get-recent_tasks`, (req, res, ctx) => {
//         return res(ctx.status(200), ctx.json({ message: "Tasks retrieved successfully.", data: tasks.slice().reverse().slice(0, 5) }));
//     }),
//
//     // create task
//     http.post(`${API_BASE}/create-task`, async (req, res, ctx) => {
//         const body = await req.json();
//         const newTask: Task = {
//             id: Math.max(...tasks.map(t => t.id)) + 1,
//             title: body.title,
//             description: body.description,
//             createdAt: new Date().toISOString(),
//             completed: false,
//         };
//         tasks.push(newTask);
//         return res(ctx.status(201), ctx.json({ message: "Task has been successfully created.", data: newTask }));
//     }),
//
//     // mark task
//     http.get(`${API_BASE}/mark-task/:id`, (req, res, ctx) => {
//         const id = Number(req.params.id);
//         const found = tasks.find((t) => t.id === id);
//         if (found) {
//             found.completed = true;
//             return res(ctx.status(200), ctx.json({ message: "Task has been successfully marked.", data: null }));
//         }
//         return res(ctx.status(404), ctx.json({ message: "Task not found.", data: null }));
//     }),
// ];


import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("http://localhost:9091/api/v1/task/create-task", async () => {
        return HttpResponse.json(
            {
                message: "Task has been successfully created.",
                data: {
                    id: 10,
                    title: "t10",
                    description: "d10",
                    createdAt: new Date().toISOString(),
                    completed: false,
                },
            },
            { status: 201 }
        );
    }),

    http.get("http://localhost:9091/api/v1/task/get-recent_tasks", async () => {
        return HttpResponse.json(
            {
                message: "Tasks retrieved successfully.",
                data: [
                    {
                        id: 10,
                        title: "t10",
                        description: "d10",
                        createdAt: new Date().toISOString(),
                        completed: false,
                    },
                ],
            },
            { status: 200 }
        );
    }),

    http.get("http://localhost:9091/api/v1/task/mark-task/:id", async () => {
        return HttpResponse.json(
            { message: "Task has been successfully marked.", data: null },
            { status: 200 }
        );
    }),
];

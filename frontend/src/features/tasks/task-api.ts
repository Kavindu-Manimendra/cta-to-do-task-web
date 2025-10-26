import type {ApiResponse, Task} from "./taskTypes.ts";
import api from "../../api/axios.ts";

export const createTask = async (task: { title: string; description: string }) => {
    console.log("create task api...");
    const response = await api.post<ApiResponse<Task>>('/create-task', task);
    return response.data.data;
};

export const getRecentTasks = async () => {
    console.log("get recent tasks api...");
    const response = await api.get<ApiResponse<Task[]>>('/get-recent_tasks');
    return response.data.data;
};

export const markTask = async (id: number) => {
    console.log("mark task api...");
    const response = await api.get<ApiResponse<null>>(`/mark-task/${id}`);
    return response.data;
};
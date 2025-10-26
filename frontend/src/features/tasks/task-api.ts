import type {ApiResponse, Task} from "./taskTypes.ts";
import api from "../../api/axios.ts";

export const createTask = async (task: { title: string; description: string }) => {
    const response = await api.post<ApiResponse<Task>>('/create-task', task);
    return response.data.data;
};

export const getRecentTasks = async () => {
    const response = await api.get<ApiResponse<Task[]>>('/get-recent_tasks');
    return response.data.data;
};

export const markTask = async (id: number) => {
    const response = await api.get<ApiResponse<null>>(`/mark-task/${id}`);
    return response.data;
};
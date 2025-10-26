export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    completed: boolean;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}
import axios from "axios";

const baseURL = 'http://localhost:9091/api/v1/task';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
});

export default api;
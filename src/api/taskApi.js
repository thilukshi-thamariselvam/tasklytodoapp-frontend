import axiosInstance from './axiosInstance';

export const createTask = (taskData) => axiosInstance.post('/tasks', taskData);

export const getTasks = (userId) => axiosInstance.get(`/tasks?userId=${userId}`);
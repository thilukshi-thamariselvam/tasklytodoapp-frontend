import axiosInstance from './axiosInstance';

export const createTask = (taskData) => axiosInstance.post('/tasks', taskData);

export const getTasks = (userId) => axiosInstance.get(`/tasks?userId=${userId}`);

export const updateTask = (taskId, taskData) => axiosInstance.patch(`/tasks/${taskId}`, taskData);

export const deleteTask = (taskId) => axiosInstance.delete(`/tasks/${taskId}`);

export const completeTask = (taskId) => axiosInstance.patch(`/tasks/${taskId}/complete`);
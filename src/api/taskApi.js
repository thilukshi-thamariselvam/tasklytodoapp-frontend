import axiosInstance from './axiosInstance';

export const createTask = (taskData) => axiosInstance.post('/tasks', taskData);
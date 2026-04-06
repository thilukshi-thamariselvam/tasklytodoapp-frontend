import axiosInstance from './axiosInstance';

export const createTask = (taskData) => axiosInstance.post('/tasks', taskData);

export const createTaskWithFile = (taskData, file) => {
    const formData = new FormData();

    const taskBlob = new Blob([JSON.stringify(taskData)], {
        type: 'application/json'
    });
    formData.append('task', taskBlob);

    if (file) {
        formData.append('file', file);
    }
    return axiosInstance.post('/tasks', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getTasks = (userId) => axiosInstance.get(`/tasks?userId=${userId}`);

export const updateTask = (taskId, taskData) => axiosInstance.patch(`/tasks/${taskId}`, taskData);

export const deleteTask = (taskId) => axiosInstance.delete(`/tasks/${taskId}`);

export const completeTask = (taskId) => axiosInstance.patch(`/tasks/${taskId}/complete`);

export const getTaskById = (taskId) => axiosInstance.get(`/tasks/${taskId}`);

export const searchTasks = (userId, query) => axiosInstance.get(`/tasks/search?userId=${userId}&query=${query}`);
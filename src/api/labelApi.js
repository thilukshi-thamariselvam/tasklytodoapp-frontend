import axiosInstance from './axiosInstance';

export const getLabels = (userId) => axiosInstance.get(`/labels?userId=${userId}`);

export const createLabel = (labelData) => axiosInstance.post('/labels', labelData);
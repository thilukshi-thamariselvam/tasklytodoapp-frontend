import { useQuery } from '@tanstack/react-query';
import { getTasks, getTaskById } from '../api/taskApi';

export const useTasks = (userId) => {
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => getTasks(userId).then((res) => res.data),
    staleTime: 30 * 1000,
  });
};

export const useTaskById = (taskId) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId).then((res) => res.data),
    enabled: !!taskId,
  });
};
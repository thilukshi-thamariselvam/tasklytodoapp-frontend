import { useQuery } from '@tanstack/react-query';
import { getTasks, getTaskById, searchTasks } from '../api/taskApi';

export const useTasks = (userId) => {
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => getTasks(userId).then((res) => res.data.data),
    staleTime: 30 * 1000,
  });
};

export const useTaskById = (taskId) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId).then((res) => res.data.data),
    enabled: !!taskId,
  });
};

export const useSearchTasks = (userId, query) => {
  return useQuery({
    queryKey: ['tasks', 'search', userId, query],
    queryFn: () => searchTasks(userId, query).then((res) => res.data.data),
    enabled: query !== undefined && query.length > 1,
  });
};
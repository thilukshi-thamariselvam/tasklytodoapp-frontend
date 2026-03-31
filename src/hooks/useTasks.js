import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/taskApi';

export const useTasks = (userId) => {
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => getTasks(userId).then((res) => res.data),
    staleTime: 30 * 1000, 
  });
};
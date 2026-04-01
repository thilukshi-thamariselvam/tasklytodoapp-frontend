import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTask } from '../api/taskApi';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
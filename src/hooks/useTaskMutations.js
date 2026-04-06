import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask, updateTaskOrder } from '../api/taskApi';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTaskOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTaskOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', '1'] });
        }
    });
};
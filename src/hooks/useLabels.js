import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabels, createLabel } from '../api/labelApi';

export const useLabels = (userId) => {
  return useQuery({
    queryKey: ['labels', userId],
    queryFn: () => getLabels(userId).then((res) => res.data.data),
    staleTime: 30 * 1000,
  });
};

export const useCreateLabel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });
};
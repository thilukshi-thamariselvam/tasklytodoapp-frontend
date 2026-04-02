import { useQuery } from '@tanstack/react-query';
import { getLabels } from '../api/labelApi';

export const useLabels = (userId) => {
  return useQuery({
    queryKey: ['labels', userId],
    queryFn: () => getLabels(userId).then((res) => res.data.data),
    staleTime: 30 * 1000,
  });
};
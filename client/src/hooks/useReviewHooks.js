import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, createReview } from '../api/reviews.api';

export const useReviews = (type) => {
  return useQuery({
    queryKey: ['reviews', type],
    queryFn: () => getReviews(type),
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

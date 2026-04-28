import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/axios'
import { addReview } from '../api/reviews.api'

export const useReviews = (type) => {
  return useQuery({
    queryKey: ['reviews', type],
    queryFn: async () => {
      const response = await axios.get(`/reviews?type=${type}`)
      return response.data
    },
  })
}

export const useAddReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

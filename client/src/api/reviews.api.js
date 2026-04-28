import axios from '../lib/axios';

export const addReview = async (reviewData) => {
  // reviewData should contain jobId, rating, and comment
  const response = await axios.post('/reviews', reviewData);
  return response.data;
};

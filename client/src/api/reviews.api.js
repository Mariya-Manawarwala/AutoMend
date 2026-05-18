import api from '../lib/axios';

export const getReviews = async (type = 'garage') => {
  const response = await api.get(`/reviews?type=${type}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

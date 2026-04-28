import axios from '../lib/axios';

export const sendChatMessage = async (message) => {
  const response = await axios.post('/chat', { message });
  return response.data;
};

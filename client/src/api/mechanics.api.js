import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api');

// Public: fetch all mechanics (no auth)
export const getPublicMechanics = async (limit = 3) => {
  const { data } = await axios.get(`${BASE}/users/mechanics/public?limit=${limit}`);
  return data;
};

// Public: fetch a single mechanic by id (no auth)
export const getPublicMechanic = async (id) => {
  const { data } = await axios.get(`${BASE}/users/mechanic/${id}`);
  return data;
};

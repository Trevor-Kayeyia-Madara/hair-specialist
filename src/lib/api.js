import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

export const getSpecialists = async () => {
  return axios.get(`${API_URL}/specialists`);
};

export const searchSpecialists = async (query) => {
  return axios.get(`${API_URL}/specialists/search`, { params: query });
};

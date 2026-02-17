import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";


export const loginUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/login`, userData);
  return res.data;
};


export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/register`, userData);
  return res.data;
};

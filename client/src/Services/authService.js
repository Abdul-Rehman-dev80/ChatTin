import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Login user with phone and password
 * @param {Object} userData - User credentials
 * @param {string} userData.phone - User phone number
 * @param {string} userData.password - User password
 * @returns {Promise} API response data
 */
export const loginUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/login`, userData);
  return res.data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.phone - Phone number
 * @param {string} userData.password - Password
 * @returns {Promise} API response data
 */
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/register`, userData);
  return res.data;
};

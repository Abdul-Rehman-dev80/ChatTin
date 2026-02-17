import api from "./axiosInstance";

// Get users with search and pagination
export const getUsers = async ({ search = "", pageParam = 1 }) => {
  const res = await api.get(`/users`, {
    params: {
      search: search,
      page: pageParam,
      limit: 20,
    },
  });
  return res.data; // Return full response with users, currentPage, totalPages, etc.
};
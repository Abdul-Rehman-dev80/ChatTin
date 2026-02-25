import api from "./axiosInstance";

/** Fetch all call logs for the current user. */
export const getCalls = async () => {
  const res = await api.get("/getCalls");
  return res.data;
};
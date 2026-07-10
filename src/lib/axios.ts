import axios from "axios";
import { env } from "@/env";

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_DJANGO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || error.message || error);
  }
);

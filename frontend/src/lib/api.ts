import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const TOKEN_KEY = "tasty_auth_token";
export const USER_KEY = "tasty_user";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      localStorage.getItem(TOKEN_KEY)
    ) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("tasty:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;

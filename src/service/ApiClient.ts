// src/service/ApiClient.ts
import axios, { type AxiosInstance } from "axios";

const API_BASE = import.meta.env.VITE_MAIN_API ?? "http://localhost:3000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 8_000,
});

// Attach the token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

import axios from "axios";

// Normalize the API base URL — works regardless of whether
// VITE_API_URL ends with /api or not, or uses localhost
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Strip any trailing /api or trailing slash so we always append /api once
const cleanBase = rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
const BASE_URL = `${cleanBase}/api`;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
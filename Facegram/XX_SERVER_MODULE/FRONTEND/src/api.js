import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:80/lks_26/Facegram/latihan/XX_SERVER_MODULE/BACKEND/public/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

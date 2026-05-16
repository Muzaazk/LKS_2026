import axios from "axios";

// const baseUrlApi =
//   "http://localhost/lks_26/KISI_KISI_JATENG/SERVER_SIDE/BACKEND/api/v1";
// const api = axios.create({
//   baseURL: baseUrlApi,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(function (config) {
//   const $token = localStorage.getItem("token");
//   if ($token) {
//     config.headers.Authorization = `Bearer ${$token}`;
//   }
//   return config;
// });

// export default api;

const api = axios.create({
  baseURL: "baseURL",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

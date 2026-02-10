import axios from "axios";
import { clearAccessToken, getAccessToken } from "../auth/token";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10_000
})

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    // não mandar no login
    const url = config.url ?? ""
    const isLogin = url.includes("/auth/login") || url.includes("/login");

    if (token && !isLogin) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

  return config;
})

// se receber 401, desloga
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAccessToken();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
)

export default api
import axios from "axios";

export const BACKEND_API= import.meta.env.VITE_APP_API_URL;

const api = axios.create({

  baseURL: `${BACKEND_API}/api/v1`
});

export const fileApi= axios.create({
  baseURL: `${BACKEND_API}/api/files`
});

export default api;

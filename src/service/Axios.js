import axios from "axios";


const api = axios.create({

  baseURL: `https://superdrop-xychcyn4.b4a.run/api/v1`
});

export const fileApi= axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api/v1/api/files`
});

export default api;

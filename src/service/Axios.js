import axios from "axios";

 export const url="https://senderbackend-35quh1uz.b4a.run"
const api = axios.create({

  baseURL: `${url}/api/v1`
});

export const fileApi= axios.create({
  baseURL: `${url}/api/v1/api/files`
});

export default api;

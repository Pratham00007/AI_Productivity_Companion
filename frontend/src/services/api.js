import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-productivity-companion.onrender.com",
  withCredentials: true,
});

export default api;
import axios from "axios";
import constantApi from "./constantApi";

const api = axios.create({
  baseURL: constantApi.baseUrl,
  withCredentials: true, // 🔥 THIS FIXES LOGOUT
});

export default api;

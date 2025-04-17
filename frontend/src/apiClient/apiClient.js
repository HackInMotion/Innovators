import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 10000,
});

export default apiClient;

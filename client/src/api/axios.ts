import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
  "https://smart-leads-dashboard-f1ez.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
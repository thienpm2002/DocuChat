import axios from "axios"

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
})

publicClient.interceptors.response.use(
    response => response.data,
)

export default publicClient;
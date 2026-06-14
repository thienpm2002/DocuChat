import axios from "axios";

import publicClient from "./publicClient";
import useAuthStore from "@/features/auth/store/authStore";

const privateClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
})

// Store accessToken in memory
let accessToken = null;
export const setAccessToken = token => accessToken = token;
export const getAccessToken = () => accessToken;

// Queue cho race condition
let isRefresh = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach(q => error ? q.reject(error) : q.resolve(token));
    failedQueue = []
}

// ────────────────────── REQUEST INTERCEPTOR ──────────────────────
privateClient.interceptors.request.use(
    (config) => {
        if(accessToken) config.headers.Authorization = `Bearer ${accessToken}`
        return config;
    },
)

// ────────────────────── RESPONSE INTERCEPTOR ──────────────────────
privateClient.interceptors.response.use(
    response => response.data,

    async (error) => {
       const originalRequest = error.config;

       if(error.response?.status === 401 && !originalRequest._retry){
         
        if(isRefresh){
            return new Promise((resolve, reject) => 
                failedQueue.push({ resolve, reject })
            ).then(accessToken => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return privateClient(originalRequest);
            })
        }

        isRefresh = true;
        originalRequest._retry = true;

        try {
            const data = await publicClient.post('/auth/refresh');
            const newAccessToken = data.accessToken;
            setAccessToken(newAccessToken);
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return privateClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            setAccessToken(null);
            useAuthStore.getState().logout();
            window.location.href = "/auth/login";

            return Promise.reject(refreshError);
        } finally {
            isRefresh = false;
        }
        
       }

       return Promise.reject(error);
    }
)


export default privateClient
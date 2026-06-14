import privateClient from "./privateClient";
import publicClient from "./publicClient";

export const authApi = {
    login: (data) => publicClient.post('/auth/login', data),

    signUp: (data) => publicClient.post('/auth/sign-up', data),

    logout: () => privateClient.post('/auth/logout'),

    refresh: () => publicClient.post('/auth/refresh')
}
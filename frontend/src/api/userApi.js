import privateClient from "./privateClient";

export const userApi = {
    getMe: () => privateClient.get('/users/me'),

    updateAccount: (data) => privateClient.put('/users/me', data),

    updateAvatar: (formData) => privateClient.patch('/users/me/avatar', formData),

    getStats: () => privateClient.get('/users/me/stats'),
}
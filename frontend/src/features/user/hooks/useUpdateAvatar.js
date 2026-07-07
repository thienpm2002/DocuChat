import { userApi } from "@/api/userApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from '@/features/auth/store/authStore'

export const useUpdateAvatar = () => {

    const setUser = useAuthStore(state => state.setUser);

    return useMutation({
        mutationFn: (formData) => userApi.updateAvatar(formData),

        onSuccess: (updatedUser) => {
            setUser(updatedUser);
        }
    });

};
import { userApi } from "@/api/userApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from '@/features/auth/store/authStore'

export const useUpdateAccount = () => {

    const setUser = useAuthStore(state => state.setUser);

    return useMutation({
        mutationFn: (data) => userApi.updateAccount(data),

        onSuccess: (updatedUser) => {
            setUser(updatedUser);
        }
    });

};
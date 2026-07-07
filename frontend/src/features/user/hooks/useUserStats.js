import { userApi } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";

export const useUserStats = () => {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: () => userApi.getStats(),
    });
};
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chatApi";

export const useChatSessionsQuery = (params) => {
    return useQuery({
        queryKey: ['chats', params],
        queryFn: () => chatApi.list(params),

        staleTime: 30 * 1000, 
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
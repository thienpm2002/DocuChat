import { chatApi } from "@/api/chatApi";
import { useQuery } from "@tanstack/react-query";

export const useChatSession = (chatSessionId) => {
    return useQuery({
        queryKey: ["chat", chatSessionId],
        queryFn: () => chatApi.details(chatSessionId),

        staleTime: 30 * 1000, 
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
} 
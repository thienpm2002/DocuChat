import { chatApi } from "@/api/chatApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteChatSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatSessionId) => chatApi.remove(chatSessionId),

        onSuccess: () => {
            
            queryClient.invalidateQueries({
                queryKey: ["chats"],
                exact: false,
            });
        },
    });
}
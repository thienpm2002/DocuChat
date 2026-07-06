import { chatApi } from "@/api/chatApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateChatSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => chatApi.create(data),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["chats"],
                exact: false,
            });
        },
    });
}
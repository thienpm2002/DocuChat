import { chatApi } from "@/api/chatApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateChatSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => chatApi.update(data),

        onSuccess: () => {
            // refetch list documents sau khi upload
            queryClient.invalidateQueries({
                queryKey: ["chats"],
                exact: false,
            });

            queryClient.invalidateQueries({
                queryKey: ["chat"],
                exact: false,
            });
        },
    });
}
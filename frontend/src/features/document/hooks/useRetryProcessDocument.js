import { documentApi } from "@/api/documentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRetryProcessDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId) => documentApi.retry(documentId),

        onSuccess: () => {
            // refetch list documents sau khi upload
            queryClient.invalidateQueries({
                queryKey: ["documents"],
                exact: false,
            });
        },
    });
}
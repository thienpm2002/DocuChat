import { documentApi } from "@/api/documentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId) => documentApi.remove(documentId),

        onSuccess: () => {
            // refetch list documents sau khi upload
            queryClient.invalidateQueries({
                queryKey: ["documents"],
                exact: false,
            });
        },
    });
}
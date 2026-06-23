import { documentApi } from "@/api/documentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ formData, signal }) => documentApi.upload(formData, signal),

        onSuccess: () => {
            // refetch list documents sau khi upload
            queryClient.invalidateQueries({
                queryKey: ["documents"],
                exact: false,
            });
        },
    });
}
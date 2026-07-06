import { useInfiniteQuery } from "@tanstack/react-query"
import { chatApi } from "@/api/chatApi"

export const useMessages = ({ chatSessionId, size = 20 }) => {
    return useInfiniteQuery({
        queryKey: ['messages', chatSessionId],
        queryFn: ({ pageParam = 0 }) => chatApi.listMessages({ chatSessionId, page: pageParam, size }),

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.page + 1
            return nextPage < lastPage.totalPages ? nextPage : undefined
        },

        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
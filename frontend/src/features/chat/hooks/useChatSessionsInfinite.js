import { useInfiniteQuery } from "@tanstack/react-query"
import { chatApi } from "@/api/chatApi"

export const useChatSessionsInfinite = () => {
    return useInfiniteQuery({
        queryKey: ['chats'],
        queryFn: ({ pageParam = 0 }) => chatApi.list({ page: pageParam, size: 15 }),

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
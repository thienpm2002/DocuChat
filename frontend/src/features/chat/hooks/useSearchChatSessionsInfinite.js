import { useInfiniteQuery } from "@tanstack/react-query"
import { chatApi } from "@/api/chatApi"

export const useSearchChatSessionsInfinite = (keyword, enabled) => {
    return useInfiniteQuery({
        queryKey: ['chats', keyword],

        queryFn: ({ pageParam = 0, signal }) => chatApi.list({ keyword, page: pageParam, size: 10, signal }),

        enabled: keyword.trim().length > 0 && enabled,

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
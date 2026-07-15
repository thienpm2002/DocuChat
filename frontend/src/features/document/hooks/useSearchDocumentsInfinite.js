import { useInfiniteQuery } from "@tanstack/react-query"
import { documentApi } from "@/api/documentApi"

export const useSearchDocumentsInfinite = (keyword, enabled) => {
    return useInfiniteQuery({
        queryKey: ['documents', keyword],

        queryFn: ({ pageParam = 0, signal }) => documentApi.list({ keyword, page: pageParam, size: 10, signal }),

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
import useSearchStore from "../store/useSearchStore";
import { useSearchDocumentsInfinite } from "@/features/document/hooks";
import { useSearchChatSessionsInfinite } from "@/features/chat/hooks";

const useSearch = (keyword, debouncedKeyword) => {
    const tab = useSearchStore(state => state.tab);

    const chatQuery = useSearchChatSessionsInfinite(
        debouncedKeyword,
        tab === "chats"
    );

    const documentQuery = useSearchDocumentsInfinite(
        debouncedKeyword,
        tab === "documents"
    );

    const activeQuery =
        tab === "chats"
            ? chatQuery
            : documentQuery;

    const items = activeQuery.data?.pages.flatMap(page => page.data) ?? [];
    
    const isSearching = keyword.trim().length > 0 && (keyword !== debouncedKeyword || activeQuery.isFetching);    

    return {
        items,
        isSearching: isSearching,
        hasNextPage: activeQuery.hasNextPage,
        fetchNextPage: activeQuery.fetchNextPage,
        isFetchingNextPage: activeQuery.isFetchingNextPage,
    };
};

export default useSearch;
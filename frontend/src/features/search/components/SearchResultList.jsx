import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CommandList } from "@/components/ui/command";

import ChatSearchItem from "./ChatSearchItem";
import DocumentSearchItem from "./DocumentSearchItem";
import SearchItemSkeleton from "./SearchItemSkeleton";

const SearchResultList = ({
  keyword,
  items = [],
  type,
  isSearching,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    skip: !hasNextPage,
  });

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (keyword.trim().length === 0) {
    return (
        <CommandList className="flex max-h-105 w-full flex-col items-center justify-center p-8 text-sm text-muted-foreground scrollbar-gutter-stable">
            Start typing to search
        </CommandList>
    );
  }

  if (isSearching) {
    return (
        <CommandList className="max-h-105 space-y-1 px-2 py-2">
        {Array.from({ length: 5 }).map((_, index) => (
            <SearchItemSkeleton key={index} />
        ))}
        </CommandList>
    );
  }

  if (items.length === 0) {
    return (
      <CommandList className="flex max-h-105 w-full flex-col items-center justify-center gap-2.5 py-12 scrollbar-gutter-stable">
        <div className="space-y-0.5 text-center">
          <p className="text-sm font-medium text-foreground">
            No results found
          </p>
          <p className="text-xs text-muted-foreground">
            Try a different keyword
          </p>
        </div>
      </CommandList>
    );
  }

  return (
    <CommandList className="max-h-105 space-y-0.5 px-2 py-2">

      {items.map((item) =>
        type === "chats" ? (
          <ChatSearchItem
            key={item.id}
            chat={item}
          />
        ) : (
          <DocumentSearchItem
            key={item.id}
            document={item}
          />
        )
      )}

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
            <SearchItemSkeleton key={`loading-${index}`} />
      ))}

      {hasNextPage && <div ref={ref} className="h-2" />}
    </CommandList>
  );
};

export default SearchResultList;
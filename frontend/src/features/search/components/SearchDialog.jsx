import { useState } from 'react'

import {
  Command,
  CommandDialog,
  CommandInput,
} from "@/components/ui/command";

import useSearchStore from "../store/useSearchStore";
import SearchTabs from "./SearchTabs";
import SearchResultList from "./SearchResultList";
import useDebounce from "../hooks/useDebounce";
import useSearch from '../hooks/useSearch';

const SearchDialog = () => {
  const { open, setOpen, tab, setTab } = useSearchStore();
  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 300);

  const {
      items,
      isSearching,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
  } = useSearch(keyword, debouncedKeyword);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded-2xl border border-border/60 bg-popover p-0 shadow-2xl sm:max-w-xl"
    >
      <Command shouldFilter={false} className="rounded-2xl bg-transparent">
        <div className="flex items-center gap-3 px-4 pb-3 pt-4">
          <CommandInput
            value={keyword}
            onValueChange={setKeyword}
            placeholder="Search chats and documents..."
            className="h-5! flex-1 border-0 bg-transparent p-0 text-sm leading-5 shadow-none outline-none focus:ring-0"
          />
          {keyword.length > 0 && (
            <kbd className="hidden shrink-0 rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              esc
            </kbd>
          )}
        </div>

        <div className="mx-4 border-t border-border/50" />

        <SearchTabs tab={tab} setTab={setTab} />

        <SearchResultList
            keyword={keyword}
            items={items}
            type={tab}
            isSearching={isSearching}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
        />

        <div className="flex items-center justify-end gap-4 border-t border-border/60 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-medium">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-medium">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-medium">esc</kbd>
            close
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
};

export default SearchDialog;
import { Skeleton } from "@/components/ui/skeleton";

const SearchItemSkeleton = () => {
  return (
    <div className="flex w-full items-center gap-3 px-3 py-2.5">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-[55%]" />
        <Skeleton className="h-3 w-[30%]" />
      </div>

      <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
    </div>
  );
};

export default SearchItemSkeleton;
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import useSearchStore from "@/features/search/store/useSearchStore"

const MobileSearch = () => {

  const setOpen = useSearchStore(state => state.setOpen);

  return (
    <div onClick={() => setOpen(true)} className="md:hidden py-2 px-8 flex justify-center">
      <div className="relative w-full">
        <Search
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            size-4
            text-muted-foreground
          "
        />

        <Input
          readOnly
          className="pl-10"
          placeholder="Search..."
        />
      </div>
    </div>
  )
}

export default MobileSearch

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import useSearchStore from "@/features/search/store/useSearchStore"

const HeaderSearch = () => {

  const setOpen = useSearchStore(state => state.setOpen);

  return (
    <div onClick={() => setOpen(true)} className="hidden py-2 px-8 md:flex justify-center">
      <div className="relative md:w-80 lg:w-105">
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

export default HeaderSearch

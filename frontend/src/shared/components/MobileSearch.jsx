import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const MobileSearch = () => {
  return (
    <div className="md:hidden py-2 px-8 flex justify-center">
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
          className="pl-10"
          placeholder="Type to search..."
        />
      </div>
    </div>
  )
}

export default MobileSearch

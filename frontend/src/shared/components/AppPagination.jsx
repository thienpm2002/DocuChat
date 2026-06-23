import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const AppPagination = ({totalPages, page, onPageChange}) => {

  const genretePageNumbers = () => {
    const pageNumbers = [];

    if(page === 1) {
      for(let i = page; i <= totalPages && i <= 3; i++){
        pageNumbers.push(i);
      }
    } else if(page === totalPages){
      for(let i = page; i > 0 && i > page - 3; i--){
        pageNumbers.unshift(i);
      }
    }else{
        pageNumbers.push(page - 1);
        pageNumbers.push(page);
        pageNumbers.push(page+1);
    }

    return pageNumbers;
   }

  const pageNumbers = genretePageNumbers();

  const handlerClick = (newPage) => {
    if (newPage === page) return

    onPageChange(prev => {

      const params = new URLSearchParams(prev)

      params.set('page', newPage)

      return params
    })
  }

  const handlerNext = () => {
    const newPage = page + 1;

    if(newPage > totalPages) return;
    
    onPageChange(prev => {

      const params = new URLSearchParams(prev)

      params.set('page', newPage)

      return params
    })
  }

  const handlerPrev = () => {
    const newPage = page - 1;

    if(newPage === 0) return;
    
    onPageChange(prev => {

      const params = new URLSearchParams(prev)

      params.set('page', newPage)

      return params
    })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlerPrev}
          />
        </PaginationItem>

        {
            pageNumbers.map((p, index)=> (
                <PaginationItem key={p}>
                    <PaginationLink
                        onClick={() => handlerClick(p)}
                        isActive={p === page}
                    >
                        {p}
                    </PaginationLink>
                </PaginationItem>
            ))
        }

        <PaginationItem>
          <PaginationNext 
           onClick={handlerNext}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}

export default AppPagination

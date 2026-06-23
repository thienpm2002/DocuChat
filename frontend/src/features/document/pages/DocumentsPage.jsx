import { useSearchParams } from "react-router-dom";
import MobileSearch from "@/shared/components/MobileSearch";
import DocumentCard from "../components/DocumentCard";
import AppPagination  from "@/shared/components/AppPagination";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { useDocuments } from "../hooks";


const documents = {
    data: [
      {
        id: 1,
        fileSize: 2.4,
        status: "PROCESSING",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 2,
        fileSize: 2.4,
        status: "READY",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 3,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 4,
        fileSize: 2.4,
        status: "PROCESSING",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 5,
        fileSize: 2.4,
        status: "PROCESSING",
        originalName: "test.pdf" ,
        uploadedAt: "2026-06-16 17:20:38"
      },

      {
        id: 6,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 7,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

      {
        id: 8,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

       {
        id: 9,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },

       {
        id: 10,
        fileSize: 2.4,
        status: "FAILED",
        originalName: "test.pdf",
        uploadedAt: "2026-06-16 17:20:38" 
      },
      
    ],
    page: 0,
    size: 3,
    totalElements: 10,
    totalPages: 4
 }

const DocumentPage = () => {


  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page')) || 1;

  const { data: pageData, isLoading} = useDocuments({page: page - 1,});

  if(isLoading) return <LoadingScreen />

  return (
    <div>
      <MobileSearch />
      <div className="p-6">
        <div>
          {
            pageData?.data.map(document => <DocumentCard key={document.id} document={document}/>)
          }
        </div>
        <div className='mt-8 flex justify-center gap-2'>
        {
        pageData?.data?.length > 0 ?
         <AppPagination 
           totalPages={pageData?.totalPages} 
           page={page} 
           onPageChange={setParams}
         />
         :
         <h3>No documents found.</h3>
       } 
       </div>
      </div>
    </div>
  )
}

export default DocumentPage

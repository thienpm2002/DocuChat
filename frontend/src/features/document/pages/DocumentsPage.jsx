import { useSearchParams } from "react-router-dom";
import MobileSearch from "@/shared/components/MobileSearch";
import DocumentCard from "../components/DocumentCard";
import AppPagination  from "@/shared/components/AppPagination";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { useDocuments, useDeleteDocument, useRetryProcessDocument } from "../hooks";
import { useCreateChatSession } from "@/features/chat/hooks";

import { documentApi } from "@/api/documentApi";

import { toast } from "sonner"

import { useNavigate } from "react-router-dom";

const DocumentPage = () => {

  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page')) || 1;

  const { data: pageData, isLoading} = useDocuments({page: page - 1,});

  const deleteMutation = useDeleteDocument();
  const retryMutation = useRetryProcessDocument();
  const createMutation = useCreateChatSession();

  const navigate = useNavigate();

  const handlePreview = async (documentId) => {
      try {
        const response = await documentApi.preview(documentId);
  
        const url = URL.createObjectURL(response);
  
        window.open(url, "_blank");
      } catch (error) {
        console.error(error);
      }
    };
  
    const onDelete = async (documentId) => {
      try {
        await deleteMutation.mutateAsync(documentId)
        toast.success("Delete success");
      } catch (error) {
        toast.error("Delete failed");
      }
    } 
  
    const onRetry = async (documentId) => {
      try {
        await retryMutation.mutateAsync(documentId)
      } catch (error) {
        toast.error("Retry failed");
      }
    } 
  
    const onChat = async (data) => {
      try {
        const chatSession = await createMutation.mutateAsync(data)
        navigate(`/chats/${chatSession.id}`)
      } catch (error) {
        toast.error("Chat failed");
      }
    }
  
  if(isLoading) return <LoadingScreen />

  return (
    <div>
      <MobileSearch />
      <div className="p-6">
        <div>
          {
            pageData?.data.map(document => 
              <DocumentCard 
                key={document.id} 
                document={document} 
                handlePreview={handlePreview}
                onDelete={onDelete}
                onRetry={onRetry}
                onChat={onChat}
                deletePending={deleteMutation.isPending}
                retryPending={retryMutation.isPending}
              />
            )
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

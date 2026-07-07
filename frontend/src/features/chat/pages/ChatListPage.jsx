import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileSearch from "@/shared/components/MobileSearch"
import AppPagination from "@/shared/components/AppPagination";
import ChatList from "../components/ChatList";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { useChatSessionsQuery, useDeleteChatSession, useUpdateChatSession } from "../hooks";
import LoadingScreen from "@/shared/components/LoadingScreen";

import { toast } from "sonner"

const ChatListPage = () => {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const isDesktop = useIsDesktop()

  const page = Number(params.get('page')) || 1
  const { data: pageData, isLoading } = useChatSessionsQuery({ page: page - 1 })

  const deleteMutation = useDeleteChatSession();
  const updateMutation = useUpdateChatSession();

  const onDelete = async (chatSessionId) => {
    try {
      await deleteMutation.mutateAsync(chatSessionId);
    } catch (error) {
      toast.error("Delete failed");
    }
  }

  const onUpdate = async (data) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      toast.error("Update failed");
    }
  }

  useEffect(() => {
    if (isDesktop) {
      navigate('/documents', { replace: true })
    }
  }, [isDesktop])


  if(isLoading) return <LoadingScreen />

  return (
    <div>
      <MobileSearch />
      <div className="p-6">
        
        <div className="flex flex-col">
          <ChatList 
            chats={pageData.data} 
            onDelete={onDelete} 
            deletePending={deleteMutation.isPending} 
            onUpdate={onUpdate} 
            updatePending={updateMutation.isPending} 
          />
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {pageData?.data?.length > 0 ? (
            <AppPagination
              totalPages={pageData?.totalPages}
              page={page}
              onPageChange={setParams}
            />
          ) : (
            <div></div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ChatListPage
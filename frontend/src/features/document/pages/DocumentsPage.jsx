import useAuthStore from "@/features/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";
import { toast } from "sonner"
import { setAccessToken } from "@/api/privateClient"

const DocumentPage = () => {

  // const user = useAuthStore(state => state.user);
  // const logout = useAuthStore(state => state.logout);
  const logoutMutation = useLogout();

  const handlerLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // setAccessToken(null);
      // logout();
      toast.success("Logout successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <div>
      DocumentPage
      <Button onClick={handlerLogout}>Logout</Button>
    </div>
  )
}

export default DocumentPage

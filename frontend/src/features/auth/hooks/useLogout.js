import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/features/auth/store/authStore";
import { setAccessToken } from "@/api/privateClient"

export function useLogout() {

  const logout = useAuthStore(state => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: () => {
      setAccessToken(null);
      logout();
    }
    
  });
}
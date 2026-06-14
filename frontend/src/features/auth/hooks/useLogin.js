import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/features/auth/store/authStore";
import { setAccessToken } from "@/api/privateClient"

export function useLogin() {

  const setUser = useAuthStore(state => state.setUser);

  return useMutation({
    mutationFn: data => authApi.login(data),

    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
    }
    
  });
}
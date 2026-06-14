import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/features/auth/store/authStore";
import { setAccessToken } from "@/api/privateClient"

export function useSignUp() {

  const setUser = useAuthStore(state => state.setUser);

  return useMutation({
    mutationFn: data => authApi.signUp(data),

    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
    }
    
  });
}
import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";
import LoadingScreen from "@/shared/components/LoadingScreen";

const AuthRedirect = () => {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);

  if(loading) return <LoadingScreen />;

  return user
  ? <Navigate to="/documents" replace />
  : <Navigate to="/auth/login" replace />;
}

export default AuthRedirect

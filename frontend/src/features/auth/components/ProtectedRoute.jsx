import { Navigate } from "react-router-dom"
import useAuthStore from "../store/authStore";
import LoadingScreen from "@/shared/components/LoadingScreen";

const ProtectedRoute = ({children}) => {

  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);

  if (loading) return <LoadingScreen />;

  if(!user) return <Navigate to="/auth/login"/>;

  return children;
}

export default ProtectedRoute

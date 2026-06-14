import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LoadingScreen from "@/shared/components/LoadingScreen";

const PublicRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/documents" replace />;
  }

  return children;
};

export default PublicRoute;
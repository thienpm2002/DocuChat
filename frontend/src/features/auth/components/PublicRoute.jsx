import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LoadingScreen from "@/shared/components/LoadingScreen";

const PublicRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);

  if (user) {
    return <Navigate to="/documents" replace />;
  }

  return children;
};

export default PublicRoute;
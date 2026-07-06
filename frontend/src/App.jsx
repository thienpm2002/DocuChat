import { RouterProvider } from "react-router-dom"
import { router } from "./routes/index.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthInitializer from "./features/auth/components/AuthInitializer.jsx";
import { Toaster } from "sonner";
import useAuthStore from "./features/auth/store/authStore.js";
import LoadingScreen from "./shared/components/LoadingScreen.jsx";

const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <Toaster position="top-right" />
        <AppRouter />
      </AuthInitializer>
    </QueryClientProvider>
  )
}

function AppRouter() {
  const loading = useAuthStore(state => state.loading);

  if (loading) return <LoadingScreen />;

  return <RouterProvider router={router} />;
}

export default App

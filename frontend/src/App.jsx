import { RouterProvider } from "react-router-dom"
import { router } from "./routes/index.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthInitializer from "./features/auth/components/AuthInitializer.jsx";
import { Toaster } from "sonner";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  )
}

export default App

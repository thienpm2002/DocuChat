import MainLayout from "@/shared/layouts/MainLayout";
import DocumentPage from "@/features/document/pages/DocumentsPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AuthRedirect from "@/features/auth/components/AuthRedirect";

export const doucmentRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <AuthRedirect />
    },

    {
      path: "documents",
      element: (
        <ProtectedRoute>
          <DocumentPage />
        </ProtectedRoute>
      ), 
    },
  ],
};
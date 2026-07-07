import MainLayout from "@/shared/layouts/MainLayout";
import ProfilePage from "@/features/user/pages/ProfilePage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AuthRedirect from "@/features/auth/components/AuthRedirect";

export const userRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <AuthRedirect />
    },
    {
      path: "profile",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
    },
  ],
};
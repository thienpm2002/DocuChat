import AuthLayout from "@/features/auth/layouts/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import PublicRoute from "@/features/auth/components/PublicRoute";

export const authRoutes = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "sign-up",
      element: (
        <PublicRoute>
          <SignUpPage />
        </PublicRoute>
      ),
    },
  ],
};
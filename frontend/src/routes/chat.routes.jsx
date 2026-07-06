import MainLayout from "@/shared/layouts/MainLayout";
import ChatListPage from "@/features/chat/pages/ChatListPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AuthRedirect from "@/features/auth/components/AuthRedirect";
import ChatDetailPage from "@/features/chat/pages/ChatDetailPage";

export const chatRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <AuthRedirect />
    },

    {
      path: "chats",
      element: <ChatListPage />
    },

    {
      path: "chats/:id",
      element: <ChatDetailPage />
    },
  ],
};
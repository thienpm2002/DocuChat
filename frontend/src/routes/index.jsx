import { createBrowserRouter } from "react-router-dom";

import { authRoutes } from "./auth.routes.jsx";
import { doucmentRoutes } from "./document.routes.jsx";
import { chatRoutes } from "./chat.routes.jsx";

import NotFoundPage from "@/shared/pages/NotFoundPage";

export const router = createBrowserRouter([

  authRoutes,

  doucmentRoutes,

  chatRoutes,

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
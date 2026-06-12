import { createBrowserRouter } from "react-router-dom";

import { authRoutes } from "./auth.routes.jsx";

import NotFoundPage from "@/shared/pages/NotFoundPage";

export const router = createBrowserRouter([

  authRoutes,

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
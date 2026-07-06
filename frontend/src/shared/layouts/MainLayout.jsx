import { Outlet, useLocation, matchPath } from "react-router-dom"
import BottomNav from "../components/BottomNav"
import Header from "../components/Header"
import AppSidebar from "../components/AppSidebar"

import {
  Files,
  MessagesSquare,
  Settings,
  User,
} from "lucide-react"

const items = [
  {
    to: "/documents",
    label: "Documents",
    icon: Files,
  },
  {
    to: "/chats",
    label: "Chats",
    icon: MessagesSquare,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

const TITLES = {
  "/": "Home",
  "/documents": "Documents",
  "/chats": "Chats",
  "/settings": "Settings",
};

const MainLayout = () => {
  const location = useLocation();
  const pageTitle = TITLES[location.pathname] || "DocuChat";

  const isChatPage = matchPath(
    "/chats/:id",
    location.pathname
  );

  return (
      <div className="min-h-screen">
        <div className="flex">
          <AppSidebar items={items}/>

          <div className="flex-1 md:ml-16 lg:ml-65">
            {!isChatPage && (
              <Header pageTitle={pageTitle} />
            )}

            <main className={isChatPage? "" : "pb-20 md:pb-0"}>
              <Outlet />
            </main>
          </div>
        </div>

        <BottomNav items={items}/>
      </div>
  )
}

export default MainLayout

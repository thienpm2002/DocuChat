import { Outlet } from "react-router-dom"
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
    to: "/chat",
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

const MainLayout = () => {
  return (
      <div className="min-h-screen">
        <div className="flex">
          <AppSidebar items={items}/>

          <div className="flex-1 md:ml-16 lg:ml-65">
            <Header />

            <main className="pb-20 md:pb-0">
              <Outlet />
            </main>
          </div>
        </div>

        <BottomNav items={items}/>
      </div>
  )
}

export default MainLayout

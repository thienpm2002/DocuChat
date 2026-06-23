
import { NavLink } from "react-router-dom"

import {FileText} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from "sonner"

import { useLogout } from "@/features/auth/hooks";

import useAuthStore from "@/features/auth/store/authStore"

const AppSidebar = ({ items = [] }) => {

  const user = useAuthStore(state => state.user);

  const logoutMutation = useLogout();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <aside
      className="
        hidden
        md:flex
        md:flex-col
        md:w-16
        lg:w-65
        h-screen
        border-r
        border-border
        bg-background
        fixed
        left-0
        top-0
      "
    >
      {/* Header */}
      <header
        className="
          h-14
          border-b
          border-border
          flex
          items-center
          justify-center

          lg:justify-start
          lg:px-3
          lg:gap-3
        "
      >
        <FileText className="size-5 shrink-0" />

        <span className="hidden lg:block text-sm font-semibold">
          DocuChat
        </span>
      </header>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `
                      mx-2
                      flex
                      h-12
                      items-center
                      justify-center
                      rounded-md
                      transition-colors

                      lg:h-10
                      lg:justify-start
                      lg:px-3
                      lg:gap-3

                      ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }
                    `
                  }
                >
                  <Icon className="size-5 shrink-0 lg:size-4" />

                  <span className="hidden lg:block text-sm font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <footer
        className="
          h-14
          border-t
          border-border

          flex
          items-center
          justify-center

          lg:justify-start
          lg:px-3
        "
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 cursor-pointer outline-none"
            >
              <Avatar className="size-8">
                <AvatarImage src={user?.avatarUrl ? `${VITE_API_URL}${user.avatarUrl}` :`https://api.dicebear.com/9.x/initials/svg?seed=${user?.userName}`} />
                <AvatarFallback>TP</AvatarFallback>
              </Avatar>

              <span className="hidden lg:block text-sm font-medium">
                {user?.userName}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
          >
            <DropdownMenuItem asChild className="cursor-pointer">
              <NavLink to="/profile">
                Profile
              </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <NavLink to="/settings">
                Settings
              </NavLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </aside>
  )
}

export default AppSidebar

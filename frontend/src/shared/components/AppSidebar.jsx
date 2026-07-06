import {
    useEffect,
    useRef
} from "react"

import { NavLink, useNavigate } from "react-router-dom"

import { FileText } from "lucide-react"

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
import { useChatSessionsInfinite, useDeleteChatSession, useUpdateChatSession } from "@/features/chat/hooks"

import ChatList from "@/features/chat/components/ChatList"
import LoadingScreen from "./LoadingScreen"

const AppSidebar = ({ items = [] }) => {

  const containerRef = useRef(null)
  const bottomRef = useRef(null)

  const user = useAuthStore(state => state.user);
  
  const logoutMutation = useLogout();

  const {
      data: pageData,
      isPending,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
  } = useChatSessionsInfinite();

  const chats = pageData?.pages.flatMap(page => page.data) ?? [];

  useEffect(() => {
      if (!hasNextPage) return;

      const observer = new IntersectionObserver(
          ([entry]) => {
              if (
                  entry.isIntersecting &&
                  !isFetchingNextPage
              ) {
                  fetchNextPage();
              }
          },
          {
              root: containerRef.current
          }
      );

      if (!bottomRef.current) return;

      observer.observe(bottomRef.current);

      return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const deleteMutation = useDeleteChatSession();
  const updateMutation = useUpdateChatSession();

  const navigate = useNavigate();

  const onDelete = async (chatSessionId) => {
    try {
      await deleteMutation.mutateAsync(chatSessionId);
      navigate("/documents", { replace: true });
    } catch (error) {
      toast.error("Delete failed");
    }
  }

  const onUpdate = async (data) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      toast.error("Update failed");
    }
  }

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

      <nav className="py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to} className={item.to === '/chats' ? 'lg:hidden': ''}>
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

      {/* Chat list — hiện trên desktop */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Recents</span>
        </div>

        {/* List */}
        <div className="hidden lg:block flex-1 overflow-y-auto" ref={containerRef}>
          {
            isPending ? 
              <LoadingScreen /> 
              :  
              <>
                <ChatList
                    chats={chats}
                    onDelete={onDelete}
                    deletePending={deleteMutation.isPending}
                    onUpdate={onUpdate}
                    updatePending={updateMutation.isPending}
                />

                {/* Sentinel */}
                <div ref={bottomRef} className="h-4" />

                {isFetchingNextPage && (
                    <div className="py-3 text-center text-sm text-muted-foreground">
                        Loading...
                    </div>
                )}
            </>
          }
        </div>
      </div>

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

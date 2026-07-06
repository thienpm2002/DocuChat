import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { MoreVertical, Trash2, Pencil } from "lucide-react"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const ChatCard = ({
  chat,
  onDelete,
  deletePending,
  onUpdate,
  updatePending,
}) => {
  const location = useLocation()
  const chatSessionId = chat.id

  const [openAlertDialog, setOpenAlertDialog] = useState(false)

  const [openDialog, setOpenDialog] = useState(false)

  const [input, setInput] = useState(chat.title)
  const [error, setError] = useState("");

  const isActive = location.pathname === `/chats/${chatSessionId}`

  const updateChatSession = async (e) => {
        e.preventDefault();

        const title = input.trim();

        if (!title || title.length > 100) {
            setError("Title must be between 1 and 100 characters");
            return;
        }

        if (title === chat.title) {
            setOpenDialog(false);
            return;
        }

        try {
            await onUpdate({
            chatSessionId,
            title,
            });

            setError("");
            setOpenDialog(false);
        } catch (error) {
            // parent xử lý toast
        }
    };

  return (
    <>
      <div
        className={`
          group flex
          items-center
          justify-between
          px-4
          py-3
          cursor-pointer
          rounded-lg
          border-b
          border-gray-100
          last:border-none
          lg:border-none
          lg:px-3
          lg:py-1.5
          lg:rounded-md
          lg:mx-1
          ${isActive ? "bg-accent font-medium" : "hover:bg-accent"}
        `}
      >
        <NavLink
          to={`/chats/${chatSessionId}`}
          className="flex-1 min-w-0 mr-1"
        >
          <span className="text-sm text-gray-800 lg:text-foreground truncate block">
            {chat.title}
          </span>
        </NavLink>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex
                items-center
                justify-center
                w-7
                h-7
                rounded-md
                cursor-pointer
                hover:bg-gray-200
                shrink-0
                lg:opacity-0
                lg:group-hover:opacity-100
                lg:w-6
                lg:h-6
                lg:rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 lg:w-3.5 lg:h-3.5 lg:text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                    setInput(chat.title)
                    setError("")
                    setOpenDialog(true)
              }}
              className="focus:bg-gray-100 cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => setOpenAlertDialog(true)}
              className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete chat {chat.title}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
              All document embeddings and uploaded files will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deletePending}
              onClick={() => onDelete(chatSessionId)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle>
            Update title
          </DialogTitle>

          <form onSubmit={(e) => updateChatSession(e)}>
            <Input 
              id="title" 
              onChange={(e) => {
                setInput(e.target.value)
              }}
              value={input}
            />

            {
              error && <p className="text-red-400 mt-2">{error}</p>
            }

            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline"
                type="button"
                onClick={() => {
                    setOpenDialog(false)
                    setError("")
                    setInput(chat.title)
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button disabled={updatePending} type="submit" className="cursor-pointer">{updatePending ? "Loading..." : "Update"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>  
    </>
  )
}

export default ChatCard
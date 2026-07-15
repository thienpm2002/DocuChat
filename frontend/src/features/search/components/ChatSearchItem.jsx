import { MessageCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CommandItem } from "@/components/ui/command";

import useSearchStore from "../store/useSearchStore";

const ChatSearchItem = ({ chat }) => {
  const navigate = useNavigate();
  const setOpen = useSearchStore((state) => state.setOpen);

  const handleSelect = () => {
    setOpen(false);
    navigate(`/chats/${chat.id}`);
  };

  return (
    <CommandItem
      onSelect={handleSelect}
      className="
        group
        px-3
        py-2.5
        rounded-xl
        cursor-pointer
        aria-selected:bg-accent
        data-[selected=true]:bg-accent
      "
    >
      <div className="flex w-full items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <MessageCircle className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13.5px] font-medium leading-tight text-foreground"
            title={chat.title}
          >
            {chat.title}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Chat session
          </p>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/0 transition-colors group-aria-selected:text-muted-foreground/50" />
      </div>
    </CommandItem>
  );
};

export default ChatSearchItem;
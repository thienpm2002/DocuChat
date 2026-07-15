import { FileText, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CommandItem } from "@/components/ui/command";

import useSearchStore from "../store/useSearchStore";
import { useCreateChatSession } from "@/features/chat/hooks";

const statusConfig = {
  READY: {
    label: "Ready",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  PROCESSING: {
    label: "Processing",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
  },
  FAILED: {
    label: "Failed",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
};

const DocumentSearchItem = ({ document }) => {
  const navigate = useNavigate();
  const setOpen = useSearchStore((state) => state.setOpen);

  const createMutation = useCreateChatSession();

  const isReady = document.status === "READY";
  const isLoading = createMutation.isPending;

  const handleSelect = async () => {
    if (!isReady) return;

    try {
      let chatSessionId = document.chatSessionId;

      if (!chatSessionId) {
        const session = await createMutation.mutateAsync({
          title: document.originalName,
          documentId: document.id,
        });

        chatSessionId = session.id;
      }

      setOpen(false);
      navigate(`/chats/${chatSessionId}`);
    } catch {
      toast.error("Failed to open chat.");
    }
  };

  const status = statusConfig[document.status];

  return (
    <CommandItem
      disabled={!isReady || isLoading}
      onSelect={handleSelect}
      className="
        group
        px-3
        py-2.5
        rounded-xl
        cursor-pointer
        aria-selected:bg-accent
        data-[selected=true]:bg-accent
        data-[disabled=true]:opacity-50
      "
    >
      <div className="flex w-full items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <FileText className="h-4 w-4 text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13.5px] font-medium leading-tight text-foreground"
            title={document.originalName}
          >
            {document.originalName}
          </p>

          <p className={`mt-0.5 flex items-center gap-1.5 text-xs ${status.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </p>
        </div>

        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/0 transition-colors group-aria-selected:text-muted-foreground/50" />
        )}
      </div>
    </CommandItem>
  );
};

export default DocumentSearchItem;
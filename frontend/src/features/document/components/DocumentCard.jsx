import { FileText, MessageCircle, Trash2, RotateCcw, MoreVertical } from "lucide-react"
import { parseISO, formatDistanceToNow } from "date-fns";
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
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

const getStatusStyle = (status) => {
  switch (status) {
    case 'READY':      return 'bg-green-50 text-green-600'
    case 'PROCESSING': return 'bg-blue-50 text-blue-500'
    case 'FAILED':     return 'bg-red-50 text-red-500'
    default:           return 'bg-gray-100 text-gray-500'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'READY':      return 'Ready'
    case 'PROCESSING': return 'Processing'
    case 'FAILED':     return 'Failed'
    default:           return status
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

const formatTime = (date) => {
  if (!date) return "";

  return formatDistanceToNow(
    parseISO(date.replace(" ", "T")),
    { addSuffix: true });
};  


const DocumentCard = ({ document, handlePreview, onDelete, onRetry, onChat, deletePending, retryPending }) => {

  const documentId = document.id;

  const data = {title: document.originalName, documentId};

  const isReady = document.status === 'READY'
  const isFailed = document.status === 'FAILED'

  return (
    <div className="mb-4 bg-white border border-gray-100 rounded-xl px-3.5 py-3 flex items-center gap-3">

      {/* Icons */}
      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-red-500" />
      </div>

      {/* Document information */}
      <div className="flex-1 min-w-0">
        <p
          onClick={() => handlePreview(documentId)}
          className="
            text-sm 
            font-medium 
            text-gray-900 
            truncate 
            max-w-30 
            sm:max-w-none
            cursor-pointer
            hover:underline
            hover:text-blue-600"
        >
            {document.originalName}
        </p>
        
        <p 
          className="
            text-xs 
            text-gray-400 
            mt-0.5"
        >
          {formatFileSize(document.fileSize)} · {formatTime(document.createdAt)}
        </p>
      </div>

      {/* Document status */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusStyle(document.status)}`}>
        {getStatusLabel(document.status)}
      </span>
      
      {/* Document actions */}
      <div className="hidden md:flex items-center gap-2">
        {isReady && (
          <Button 
            onClick={() => onChat(data)} 
            variant="outline"
            className="
              w-8 
              h-8 
              flex 
              items-center 
              justify-center  
              cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
          </Button>
        )}

        {isFailed && (
          <Button 
            disabled={retryPending} 
            onClick={() => onRetry(documentId)} 
            variant="outline"
            className="
              w-8 
              h-8 
              flex 
              items-center 
              justify-center  
              cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                className="
                  w-8 
                  h-8 
                  flex 
                  items-center 
                  justify-center 
                  cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{`Delete ${document.originalName}?`}</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone.
                All document embeddings and uploaded files will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={deletePending} onClick={()=> onDelete(documentId)} >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

      <div className="md:hidden">
        <DropdownMenu  modal={false}>
          <DropdownMenuTrigger asChild>
            <button 
              className="
                w-8 
                h-8 
                flex 
                items-center 
                justify-center 
                outline-none 
                cursor-pointer"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {isReady && (
              <DropdownMenuItem onClick={() => onChat(data)}>
                <MessageCircle className="w-4 h-4 mr-2" /> Chat
              </DropdownMenuItem>
            )}

            {isFailed && (
              <DropdownMenuItem 
                disabled={retryPending} 
                onClick={() => onRetry(documentId)}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Retry
              </DropdownMenuItem>
            )}
            
              <AlertDialog>
                <AlertDialogTrigger asChild>
                     <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-500 focus:text-red-500 focus:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{`Delete ${document.originalName}?`}</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone.
                      All document embeddings and uploaded files will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={deletePending} onClick={() => onDelete(documentId)} >Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default DocumentCard
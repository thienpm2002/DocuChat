import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const API_URL = import.meta.env.VITE_API_URL;

const AvatarSection = ({ avatarUrl, userName, email, handleUpdateAvatar, isPending }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState("");
  const inputRef = useRef(null)

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setError("");

    if (!selected) return

    if (preview) {
        URL.revokeObjectURL(preview);
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
        setError("Only JPG, PNG and WEBP images are allowed.");
        e.target.value = "";
        return;
    }

    if (selected.size > MAX_SIZE) {
        setError("Image size must not exceed 5MB.");
        e.target.value = "";
        return;
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    await handleUpdateAvatar(formData)
    
    setOpenDialog(false)
    setPreview(null)
    setFile(null)
    setError("")

    if (inputRef.current) {
        inputRef.current.value = "";
    }
  }

  const handleCancel = () => {
    setOpenDialog(false)
    setPreview(null)
    setFile(null)
    setError("")

    if (preview) {
        URL.revokeObjectURL(preview);
    }

    if (inputRef.current) {
        inputRef.current.value = "";
    }
  }

  return (
    <>
      <div className="mb-4 bg-white border border-gray-100 rounded-xl px-3.5 py-3 flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={() => setOpenDialog(true)}>
          <Avatar className="size-15">
            <AvatarImage src={avatarUrl ? `${API_URL}${avatarUrl}` : `https://api.dicebear.com/9.x/initials/svg?seed=${userName}`} />
            <AvatarFallback>TP</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 right-0 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center">
            <Camera className="size-3 text-gray-500" />
          </div>
        </div>

        <div className='flex flex-col'>
          <span className="text-md font-bold">{userName}</span>
          <span className="text-sm font-normal text-gray-500">{email}</span>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogTitle>Update Avatar</DialogTitle>

          <div className="flex flex-col items-center gap-4 py-2">
            {/* Preview */}
            <Avatar className="size-24">
              <AvatarImage src={preview ?? (avatarUrl ? `${API_URL}${avatarUrl}` : `https://api.dicebear.com/9.x/initials/svg?seed=${userName}`)} />
              <AvatarFallback>TP</AvatarFallback>
            </Avatar>

            {/* Upload button */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer"
            >
              <Camera className="size-4 mr-2" />
              Choose photo
            </Button>

            {file && (
              <p className="text-xs text-gray-400 truncate max-w-50">{file.name}</p>
            )}

            {error && (
                <p className="text-sm text-red-500 text-center">
                {error}
                </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" type="button" onClick={handleCancel} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!file || isPending}
              onClick={handleSubmit}
              className="cursor-pointer"
            >
              {isPending ? "Uploading..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AvatarSection
import { useState, useRef } from "react"
import { Plus, Upload } from "lucide-react"
import HeaderSearch from "./HeaderSearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import { useUploadDocument } from "@/features/document/hooks"
import { toast } from "sonner"

const MAX_SIZE = 50 * 1024 * 1024;

const Header = () => {

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const controllerRef = useRef(null);

  const { mutateAsync, isPending } = useUploadDocument();

  const upload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("File size must not exceed 50 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    controllerRef.current = controller;

    // Call api
    try {
      await mutateAsync({
        formData,
        signal: controller.signal,
      });

      // Reset
      setError("")
      setFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setOpen(false)
      toast.success("Upload success");
    } catch (error) {
      toast.error("Upload failed");
    }    

  };

  const handleCancelUpload = () => {
    controllerRef.current?.abort();
    setError("");
    setFile(null);
  };

  return (
    <header
        className="
          sticky
          top-0
          z-10
          h-14
          border-b
          border-border
          bg-background
          flex
          items-center
          justify-between
          px-8
        "
      >
      <h2 className="font-bold text-[20px]">Documents</h2>
      <HeaderSearch />
      <Button 
        onClick ={() =>setOpen(true)} 
        className="
          md:hidden 
          w-8 
          h-8 
          rounded-[8px] 
          flex 
          justify-center 
          items-center 
          cursor-pointer"
        >
        <Plus className="size-5"/>
      </Button>

      <Button 
        onClick ={() =>setOpen(true)} 
        className="
          hidden 
          px-4 
          py-2 
          rounded-[8px] 
          md:flex 
          justify-center 
          items-center 
          cursor-pointer"
        >
        <Upload className="size-4"/>
        <p className="">Upload</p>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            Upload document
          </DialogTitle>

          <form onSubmit={upload}>
            <Input 
              ref={fileInputRef}
              id="file" 
              type="file" 
              onChange={(e) => {
                setFile(e.target.files?.[0])
                setError("")
              }}
            />

            {
              error && <p className="text-red-400 mt-2">{error}</p>
            }

            <div className="mt-4 flex justify-end gap-2">
              <Button 
                disabled={!isPending}
                variant="outline"
                type="button"
                onClick={handleCancelUpload} 
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit" className="cursor-pointer">{isPending ? "Loading..." : "Upload"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>  

    </header>
  )
}

export default Header

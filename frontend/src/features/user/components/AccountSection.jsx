import { useState, useEffect } from "react"

import { Pencil, User, Mail }  from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const AccountSection = ({ userName, email, handleUpdateAccount, isPending }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    userNameInput: "",
    emailInput: ""
  });

  const [error, setError] = useState({
    userNameError: "",
    emailError: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {};

    const { userNameInput, emailInput } = form;

    if(!userNameInput || !userNameInput.trim() || userNameInput.length > 30 || userNameInput.length < 2) {
        newError.userNameError = "Username must be between 2 and 30 characters";
    }

    if(!emailInput || !emailInput.trim() || !/^\S+@\S+\.\S+$/.test(emailInput) || emailInput.length > 255) {
        newError.emailError = "Please enter a valid email address (less than 255 characters)";
    }

    setError({
        userNameError: newError.userNameError,
        emailError: newError.emailError
    });

    if (Object.keys(newError).length > 0) {
        return;
    }

    if(userNameInput === userName && emailInput === email) {
        return;
    }

    await handleUpdateAccount({ userName: userNameInput, email: emailInput });
    setOpenDialog(false);

  }

   useEffect(() => {
        if (openDialog) {
            setForm({
                userNameInput: userName ?? "",
                emailInput: email ?? ""
            });
        }
   }, [openDialog, userName, email]);

  return (
    <>
        <div className="mb-4 bg-white border border-gray-100 rounded-xl py-3 flex flex-col gap-3">
            <div className='flex justify-between items-center border-b border-gray-200 pb-2 px-3.5'>
                    <span className="text-sm font-bold text-gray-500">Account</span>
                    <button onClick={() => setOpenDialog(true)} className='flex items-center gap-1 text-sm font-medium cursor-pointer border border-border rounded-md px-3 py-1.5 text-foreground hover:bg-accent transition-colors'>
                        <Pencil className="size-3" />
                        <span>Edit</span>
                    </button>
            </div>

            <div className='flex justify-between items-center border-b border-gray-200 pb-2 px-3.5'>
                    <div className='text-gray-500 flex gap-1 items-center'>
                        <User className="size-4" />
                        <span className="text-sm font-normal">Username</span>
                    </div>
                    <p className="text-sm font-bold">{userName}</p>
            </div>

            <div className='flex justify-between items-center px-3.5'>
                    <div className='text-gray-500 flex gap-1 items-center'>
                        <Mail className="size-4" />
                        <span className="text-sm font-normal">Email</span>
                    </div>
                    <p className="text-sm font-bold">{email}</p>
            </div>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <DialogTitle>
                    Update Account
                </DialogTitle>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <Label htmlFor="userName" className="text-sm font-medium text-gray-700 mt-4 mb-2">Username</Label>
                    <Input 
                        id="userName" 
                        onChange={(e) => {
                            setForm(prev => ({
                                ...prev,
                                userNameInput: e.target.value
                            }))
                        }}
                        value={form.userNameInput}
                    />

                    {
                        error.userNameError && <p className="text-red-400 mt-2">{error.userNameError}</p>
                    }

                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mt-4 mb-2">Email</Label>
                    <Input 
                        type="email"
                        id="email" 
                        onChange={(e) => {
                            setForm(prev => ({
                                ...prev,
                                emailInput: e.target.value
                            }))
                        }}
                        value={form.emailInput}
                    />

                    {
                        error.emailError && <p className="text-red-400 mt-2">{error.emailError}</p>
                    }

                    <div className="mt-4 flex justify-end gap-2">
                        <Button 
                            variant="outline"
                            type="button"
                            className="cursor-pointer"
                            onClick={() => {
                                setOpenDialog(false)
                                setError({
                                    userNameError: "",
                                    emailError: ""
                                })
                                setForm({
                                    userNameInput: userName,
                                    emailInput: email
                                })
                            }}
                        >
                            Cancel
                        </Button>

                        <Button disabled={isPending} type="submit" className="cursor-pointer">{isPending ? "Updating..." : "Update"}</Button>
                    </div>
                </form>
            </DialogContent>
      </Dialog>  

    </>


  )
}

export default AccountSection


import useAuthStore from '@/features/auth/store/authStore'

import { Skeleton } from "@/components/ui/skeleton"  
import { toast } from "sonner"

import { LogOut } from 'lucide-react'
 
import SecuritySection from '../components/SecuritySection'
import AccountSection from '../components/AccountSection'
import AvatarSection from '../components/AvatarSection'

import { useUserStats, useUpdateAccount, useUpdateAvatar } from '../hooks'
import { useLogout } from "@/features/auth/hooks";

const ProfilePage = () => {

  const { data: userStats, isLoading } = useUserStats();  
  
  const logoutMutation = useLogout();

  const updateAccountMutation = useUpdateAccount();
  const updateAvatarMutation = useUpdateAvatar();

  const user = useAuthStore(state => state.user);

  const handleUpdateAccount = async (data) => {

    try {
      await updateAccountMutation.mutateAsync(data);
      toast.success("Account updated successfully");
    } catch (error) {
      toast.error("Failed to update account");
    }
  };

  const handleUpdateAvatar = async (formData) => {
    try {
      await updateAvatarMutation.mutateAsync(formData);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>

      {/* Avatar */}
      <AvatarSection avatarUrl={user?.avatarUrl} userName={user?.userName} email={user?.email} handleUpdateAvatar={handleUpdateAvatar} isPending={updateAvatarMutation.isPending} />

      {/* Stats */}
      {isLoading ? (
        <div className="mb-4 bg-white border border-gray-100 rounded-xl px-3.5 py-3 flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
        ) : (
        <div className="mb-4 bg-white border border-gray-100 rounded-xl px-3.5 py-3 flex items-center gap-3">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{userStats?.documentCount}</span>
                <span className="text-sm font-normal text-gray-500">Documents</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{userStats?.chatSessionCount}</span>
                <span className="text-sm font-normal text-gray-500">Chat Sessions</span>
            </div>
        </div>
        )}

      {/* Account */}
      <AccountSection userName={user?.userName} email={user?.email} handleUpdateAccount={handleUpdateAccount} isPending={updateAccountMutation.isPending} />

       {/* Security */}
       <SecuritySection />

       {/* Logout */}
       <div className="mb-4 bg-white border border-gray-100 rounded-xl py-3 flex flex-col gap-3">
            <div className='flex justify-between items-center px-3.5'>
                <div className='text-red-500 flex gap-1 items-center'>
                    <LogOut className="size-4" />
                    <span className="text-sm font-normal">Logout</span>
                </div>
                <button onClick={logout} className="text-sm font-medium cursor-pointer border border-border rounded-md px-3 py-1.5 text-foreground hover:bg-accent transition-colors">
                    Logout
                </button>
            </div>
        </div>

    </div>
  )
}

export default ProfilePage

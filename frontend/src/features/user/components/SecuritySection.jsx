
import { Lock } from 'lucide-react'

const SecuritySection = () => {
  return (
    <div className="mb-4 bg-white border border-gray-100 rounded-xl py-3 flex flex-col gap-3">
        <div className='flex justify-between items-center border-b border-gray-200 pb-2 px-3.5'>
            <span className="text-sm font-bold text-gray-500">Security</span>
        </div>

        <div className='flex justify-between items-center px-3.5'>
            <div className='text-gray-500 flex gap-1 items-center'>
                <Lock className="size-4" />
                <span className="text-sm font-normal">Password</span>
            </div>
            <button className="text-sm font-medium cursor-pointer border border-border rounded-md px-3 py-1.5 text-foreground hover:bg-accent transition-colors">
                Change
            </button>
        </div>
    </div>
  )
}

export default SecuritySection

import ChatCard from "./ChatCard"

const ChatList = ({ chats = [], onDelete, deletePending, onUpdate, updatePending }) => {

    if(chats.length === 0) return (
        <div className="flex justify-center items-center">
            <p className="text-lg lg:text-xs text-muted-foreground pt-10">No chats yet.</p>
        </div>
    )

    return (
        <div>
           {chats.map(chat => (
                <ChatCard 
                    key={chat.id} 
                    chat={chat} 
                    onDelete={onDelete} 
                    deletePending={deletePending} 
                    onUpdate={onUpdate} 
                    updatePending={updatePending} 
                />
            ))}
        </div>
    )
  
}

export default ChatList

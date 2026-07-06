import privateClient from "./privateClient";
import { getAccessToken } from "./privateClient";

export const chatApi = {
    create: (data) => privateClient.post('/chat-sessions', data),

    remove: (chatSessionId) => privateClient.delete(`/chat-sessions/${chatSessionId}`),

    list: (params) => privateClient.get("/chat-sessions", { params }),
    
    details: (chatSessionId) => privateClient.get(`/chat-sessions/${chatSessionId}`),

    update: ({ title, chatSessionId }) => privateClient.patch(`/chat-sessions/${chatSessionId}`, {title}),

    listMessages: ({chatSessionId, page, size}) => privateClient.get(`/chat-sessions/${chatSessionId}/messages`, { params: { page, size } }),

    createMessage: (chatSessionId, content) => fetch(
        `${import.meta.env.VITE_API_URL}/chat-sessions/${chatSessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify({ content })
        }
      ),
}
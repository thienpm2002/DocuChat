import privateClient from "./privateClient";

export const documentApi = {
    upload: (formData, signal) => privateClient.post('/documents/upload', formData, {signal}),

    remove: (documentId) => privateClient.delete(`/documents/${documentId}`),

    list: ({ signal, ...params }) => privateClient.get("/documents", { params, signal }),

    preview: (documentId) => privateClient.get(`/documents/${documentId}/preview`, {
        responseType: "blob",
    }),

    retry: (documentId) => privateClient.post(`/documents/${documentId}/retry`),
}
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.schemas.request.chat_request import ChatRequest

from app.services.rag_service import process_document
from app.services.rag_service import delete_document
from app.services.rag_service import chat_document

def create_rag_router(pipeline):

    router = APIRouter()

    @router.post("/documents/process")
    async def process_document_api(request: ProcessDocumentRequest):
        process_document(request, pipeline)

    @router.delete("/documents/{document_id}")
    async def delete_document_api(document_id: int):
        delete_document(document_id, pipeline)    

    @router.post("/chat")
    async def chat_document_api(request: ChatRequest):

        return StreamingResponse(
            chat_document(request, pipeline),
            media_type="text/event-stream"
        )        

    return router
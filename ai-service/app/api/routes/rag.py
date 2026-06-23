from fastapi import APIRouter
from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.services.rag_service import process_document
from app.services.rag_service import delete_document

def create_rag_router(pipeline):

    router = APIRouter()

    @router.post("/documents/process")
    async def process_document_api(request: ProcessDocumentRequest):
        process_document(request, pipeline)

    @router.delete("/documents/{document_id}")
    async def delete_document_api(document_id: int):
        delete_document(document_id, pipeline)    

    return router
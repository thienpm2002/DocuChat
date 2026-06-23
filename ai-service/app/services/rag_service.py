from app.enums.status_enum import StatusEnum
from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.rag.pipeline.rag_pipeline import RAGPipeline
from pathlib import Path
from app.core.config.settings import settings

from app.exceptions.custom_exceptions import (
    DocumentProcessingException
)

def process_document(data: ProcessDocumentRequest, pipeline: RAGPipeline):

    file_path = ( Path(settings.DOCUMENT_DIR) / data.stored_name )

    if not file_path.exists():
        raise DocumentProcessingException(
            "Document file not found"
        )
    
    # Pipeline index document
    pipeline.index_document(file_path, data)

def delete_document(document_id: int, pipeline: RAGPipeline):
    pipeline.delete_document(document_id)

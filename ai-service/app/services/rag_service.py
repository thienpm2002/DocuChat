import logging

from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.schemas.request.chat_request import ChatRequest

from app.rag.pipeline.rag_pipeline import RAGPipeline
from pathlib import Path
from app.core.config.settings import settings

from app.exceptions.custom_exceptions import (
    DocumentProcessingException
)

logger = logging.getLogger(__name__)

def process_document(data: ProcessDocumentRequest, pipeline: RAGPipeline):

    logger.info(
        "Start processing document_id=%s file=%s",
        data.document_id,
        data.original_name
    )

    file_path = ( Path(settings.DOCUMENT_DIR) / data.stored_name )

    if not file_path.exists():
        raise DocumentProcessingException(
            "Document file not found"
        )
    
    # Pipeline index document
    pipeline.index_document(file_path, data)

    logger.info(
        "Finished processing document_id=%s file=%s",
        data.document_id,
        data.original_name
    )

def delete_document(document_id: int, pipeline: RAGPipeline):
    pipeline.delete_document(document_id)

def chat_document(request: ChatRequest, pipeline: RAGPipeline):
    return pipeline.ask_document(request)
    

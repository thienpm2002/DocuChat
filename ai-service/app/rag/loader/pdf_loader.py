import logging

from langchain_community.document_loaders import PyPDFLoader
from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.exceptions.custom_exceptions import DocumentProcessingException
from pathlib import Path

logger = logging.getLogger(__name__)

def load_pdf(file_path: Path, data: ProcessDocumentRequest):
    logger.info(
        "Loading PDF: %s",
        file_path.name
    )

    loader = PyPDFLoader(file_path)

    try:
        documents = loader.load()
        if not any(doc.page_content.strip() for doc in documents):
            raise DocumentProcessingException(
                "This PDF contains no extractable text. Scanned PDFs are not supported."
            )
    except Exception as ex:
        logger.exception(
            "Failed to load PDF: %s",
            file_path.name
        )

        raise DocumentProcessingException(
            "Unable to read PDF file."
        )

    for doc in documents:
        doc.metadata.update({
            "document_id": data.document_id,
            "user_id": data.user_id,
            "source": data.original_name
        })

    logger.info(
        "PDF loaded successfully: %s pages",
        len(documents)
    )  

    return documents


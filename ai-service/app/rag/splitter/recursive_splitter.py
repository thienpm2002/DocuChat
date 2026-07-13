import logging

from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.exceptions.custom_exceptions import DocumentProcessingException

logger = logging.getLogger(__name__)

def split_documents(documents):

    logger.info(
        "Start splitting document"
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=150
    )

    try:
        chunks = splitter.split_documents(documents)
    except Exception:
        logger.exception("Failed to split document")

        raise DocumentProcessingException(
            "Failed to split document."
        )

    if not chunks:    
        raise DocumentProcessingException(
            "No text chunks could be generated from this PDF."
        )    

    logger.info(
        "Generated %s chunks",
        len(chunks)
    )    

    return chunks
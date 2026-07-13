from fastapi import FastAPI

from app.api.router import create_api_router
from app.core.config.settings import settings
from app.core.config.logging import setup_logging

from fastapi.exceptions import RequestValidationError
from app.exceptions.handlers import generic_handler
from app.exceptions.handlers import validation_handler
from app.exceptions.handlers import document_processing_handler
from app.exceptions.custom_exceptions import (
    DocumentProcessingException
)

from app.rag.embedding.embedding_model import get_embedding_model
from app.rag.vector_store.chroma_store import get_vector_store
from app.rag.pipeline.rag_pipeline import RAGPipeline
from app.middleware.request_logging import request_logging_middleware

setup_logging()

app = FastAPI()

app.middleware("http")(request_logging_middleware)

embedding_model = get_embedding_model()
vector_store = get_vector_store(embedding_model)

pipeline = RAGPipeline(vector_store)

app.include_router(
    create_api_router(pipeline),
    prefix=settings.API_PREFIX
)

# Exceptions

app.add_exception_handler(
    RequestValidationError,
    validation_handler
)

app.add_exception_handler(
    DocumentProcessingException,
    document_processing_handler
)

app.add_exception_handler(
    Exception,
    generic_handler
)
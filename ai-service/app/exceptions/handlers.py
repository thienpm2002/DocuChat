import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.exceptions.custom_exceptions import (
    DocumentProcessingException
)

logger = logging.getLogger(__name__)

async def validation_handler(
    request: Request,
    exc: RequestValidationError
):
    logger.warning(
        "Validation failed: requestId=%s path=%s errors=%s",
        request.state.request_id,
        request.url.path,
        exc.errors()
    )

    return JSONResponse(
        status_code=422,
        content={
            "message": "Invalid request",
            "code": "VALIDATION_ERROR",
            "details": exc.errors()
        }
    )

async def document_processing_handler(
    request: Request,
    exc: DocumentProcessingException
):
    logger.warning(
        "Document processing failed: requestId=%s path=%s message=%s",
        request.state.request_id,
        request.url.path,
        str(exc)
    )

    return JSONResponse(
        status_code=400,
        content={
            "message": str(exc),
            "code": "DOCUMENT_PROCESSING_ERROR"
        }
    )

async def generic_handler(
    request: Request,
    exc: Exception
):
    logger.exception(
        "Unhandled exception: requestId=%s path=%s",
        request.state.request_id,
        request.url.path
    )

    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "code": "INTERNAL_SERVER_ERROR"
        }
    )
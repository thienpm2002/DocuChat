from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.exceptions.custom_exceptions import (
    DocumentProcessingException
)

async def validation_handler(
    request: Request,
    exc: RequestValidationError
):
    print(exc.errors())

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

    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "code": "INTERNAL_SERVER_ERROR"
        }
    )
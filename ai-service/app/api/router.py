from fastapi import APIRouter
from app.api.routes.rag import create_rag_router
def create_api_router(pipeline):

    api_router = APIRouter()

    api_router.include_router(
        create_rag_router(pipeline)
    )

    return api_router

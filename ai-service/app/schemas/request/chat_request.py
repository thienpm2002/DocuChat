from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    document_id: int = Field(gt=0, alias="documentId")
    question: str
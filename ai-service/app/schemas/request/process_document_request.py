from pydantic import BaseModel, Field, field_validator


class ProcessDocumentRequest(BaseModel):
    document_id: int = Field(gt=0, alias="documentId")
    user_id: int = Field(gt=0, alias="userId")

    original_name: str = Field(
        min_length=1,
        max_length=255,
        alias="originalName"
    )

    stored_name: str = Field(
        min_length=1,
        max_length=500,
        alias="storedName"
    )

    @field_validator("original_name", "stored_name")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Field cannot be blank")

        return value.strip()
    



from langchain_community.document_loaders import PyPDFLoader
from app.schemas.request.process_document_request import ProcessDocumentRequest
from pathlib import Path

def load_pdf(file_path: Path, data: ProcessDocumentRequest):
    loader = PyPDFLoader(file_path)

    documents = loader.load()

    for doc in documents:
        doc.metadata.update({
            "document_id": data.document_id,
            "user_id": data.user_id,
            "source": data.original_name
        })

    return documents


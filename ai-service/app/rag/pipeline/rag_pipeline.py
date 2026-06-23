from app.rag.loader.pdf_loader import load_pdf
from app.rag.splitter.recursive_splitter import split_documents
from app.schemas.request.process_document_request import ProcessDocumentRequest
from pathlib import Path

class RAGPipeline:
    def __init__(self, vector_store):
        self.vector_store = vector_store

    # ===== INDEXING (PROCESS DOCUMENT) =====
    def index_document(self, file_path: Path, data: ProcessDocumentRequest):
        documents = load_pdf(file_path, data)
        chunks = split_documents(documents)

        self.vector_store.add_documents(chunks)

    def delete_document(self, document_id: int):
        collection = self.vector_store._collection

        results = collection.get(
            where={"document_id": document_id}
        )

        ids = results["ids"]

        if ids:
            collection.delete(ids=ids)


    # ===== RETRIEVAL (CHAT ASK) =====
    def ask(self, question: str, k: int = 4):
        docs = self.vector_store.search(question, k=k)

        context = "\n".join([d.page_content for d in docs])

        return context
from app.rag.loader.pdf_loader import load_pdf
from app.rag.splitter.recursive_splitter import split_documents
from app.rag.prompt.get_prompt import build_prompt
from app.rag.llm.gemini_llm import get_llm
from app.rag.stream.stream import stream_answer
from app.rag.retriever.retrieve import retrieve

from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.schemas.request.chat_request import ChatRequest

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

    # ===== QA DOCUMENT =====
    def ask_document(self, request: ChatRequest):

        # B1. Embed question and Retrieve top-k chunks anh  Extract sources
        docs, sources, retrieval_status = retrieve(
            self.vector_store,
            request.question,
            request.document_id
        )

        # B3. Build context
        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        # B4. Build prompt
        prompt = build_prompt(
            question=request.question,
            context=context
        )

        # B5. Stream answer
        llm = get_llm()

        metadata = {
            "retrievalStatus": retrieval_status,
            "sources": sources
        }

        return stream_answer(
            llm=llm,
            prompt=prompt,
            metadata=metadata
        )
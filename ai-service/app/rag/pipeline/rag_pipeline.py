import logging
import time

from app.rag.loader.pdf_loader import load_pdf
from app.rag.splitter.recursive_splitter import split_documents
from app.rag.prompt.get_prompt import build_prompt
from app.rag.llm.gemini_llm import get_llm
from app.rag.stream.stream import stream_answer
from app.rag.retriever.retrieve import retrieve

from app.schemas.request.process_document_request import ProcessDocumentRequest
from app.schemas.request.chat_request import ChatRequest

from pathlib import Path

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self, vector_store):
        self.vector_store = vector_store

    # ===== INDEXING (PROCESS DOCUMENT) =====
    def index_document(self, file_path: Path, data: ProcessDocumentRequest):

        start = time.perf_counter()

        logger.info(
            "Start indexing document_id=%s",
            data.document_id
        )

        documents = load_pdf(file_path, data)

        logger.info(
            "Loaded PDF: pages=%s",
            len(documents)
        )

        chunks = split_documents(documents)

        logger.info(
            "Split completed: chunks=%s",
            len(chunks)
        )

        logger.info(
            "Generating embeddings and storing vectors"
        )

        try:
            self.vector_store.add_documents(chunks)
        except Exception:
            logger.exception(
                "Failed to store embeddings"
            )

            raise DocumentProcessingException(
                "Failed to store document embeddings."
            )

        logger.info(
            "Stored %s chunks into Chroma",
            len(chunks)
        )

        elapsed = time.perf_counter() - start

        logger.info(
            "Indexing summary: document_id=%s, pages=%s, chunks=%s, duration=%.2fs",
            data.document_id,
            len(documents),
            len(chunks),
            elapsed
        )

    # ===== DELETE DOCUMENT =====
    def delete_document(self, document_id: int):
        start = time.perf_counter()

        logger.info(
            "Start deleting vectors for document_id=%s",
            document_id
        )

        collection = self.vector_store._collection

        results = collection.get(
            where={"document_id": document_id}
        )

        ids = results["ids"]

        logger.info(
            "Found %s vectors",
            len(ids)
        )

        if ids:
            collection.delete(ids=ids)

            logger.info(
                "Deleted %s vectors",
                len(ids)
            )
        else:
            logger.warning(
                "No vectors found for document_id=%s",
                document_id
            )

        elapsed = time.perf_counter() - start

        logger.info(
            "Finished deleting vectors in %.2fs",
            elapsed
        )

    # ===== QA DOCUMENT =====
    def ask_document(self, request: ChatRequest):

        start = time.perf_counter()

        logger.info(
            "Start chat document_id=%s question=%s",
            request.document_id,
            request.question[:100]
        )

        # B1. Embed question and Retrieve top-k chunks anh  Extract sources
        docs, sources, retrieval_status = retrieve(
            self.vector_store,
            request.question,
            request.document_id
        )
        logger.info(
            "Retrieved %s chunks",
            len(docs)
        )

        # B3. Build context
        context = ""

        for i, doc in enumerate(docs, start=1):
            context += (
                f"Chunk {i} "
                f"(Page {doc.metadata['page']}):\n"
                f"{doc.page_content}\n\n"
            )
            
        logger.info(
            "Context built: chunk=%s, characters=%s",
            len(docs),
            len(context)
        )

        # B4. Build prompt
        prompt = build_prompt(
            question=request.question,
            context=context
        )
        logger.info("Prompt built")

        # B5. Stream answer
        llm = get_llm()

        metadata = {
            "retrievalStatus": retrieval_status,
            "sources": sources
        }

        logger.info(
            "Retrieval status=%s",
            retrieval_status.value
        )

        logger.info("Start streaming response")

        return stream_answer(
            llm=llm,
            prompt=prompt,
            metadata=metadata
        )